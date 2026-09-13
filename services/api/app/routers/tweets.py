import math
from datetime import datetime, timezone
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import desc, asc, or_
from services.api.app.db.session import get_db
from services.api.app.models.tweet import Tweet
from services.api.app.schemas.tweet import (
    TweetResponse, TweetCreate, PaginatedTweetsResponse, ClassifyRequest, ClassifyResponse
)
from services.api.app.services.nlp_service import nlp_service
from services.api.app.services.twitter_service import twitter_service
from services.api.app.core.websocket import manager

router = APIRouter(prefix="/tweets", tags=["tweets"])

@router.get("", response_model=PaginatedTweetsResponse)
def get_tweets(
    query: Optional[str] = Query(None, description="Search term in text or author or hashtags"),
    sentiment: Optional[str] = Query(None, description="Filter by: positive, negative, neutral, or all"),
    from_date: Optional[str] = Query(None, alias="from", description="ISO format start date"),
    to_date: Optional[str] = Query(None, alias="to", description="ISO format end date"),
    lang: Optional[str] = Query(None, description="Filter by language"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Items per page"),
    sort_by: str = Query("created_at", description="Sort by field: created_at, confidence, ingested_at"),
    sort_order: str = Query("desc", description="Sort direction: asc or desc"),
    db: Session = Depends(get_db)
):
    q = db.query(Tweet)

    if query:
        search_pattern = f"%{query}%"
        q = q.filter(
            or_(
                Tweet.text.ilike(search_pattern),
                Tweet.author.ilike(search_pattern)
            )
        )

    if sentiment and sentiment.lower() != "all":
        q = q.filter(Tweet.sentiment == sentiment.lower())

    if lang:
        q = q.filter(Tweet.lang == lang)

    if from_date:
        try:
            dt_from = datetime.fromisoformat(from_date.replace("Z", "+00:00"))
            q = q.filter(Tweet.created_at >= dt_from)
        except Exception:
            pass

    if to_date:
        try:
            dt_to = datetime.fromisoformat(to_date.replace("Z", "+00:00"))
            q = q.filter(Tweet.created_at <= dt_to)
        except Exception:
            pass

    total = q.count()

    # Sorting
    sort_col = getattr(Tweet, sort_by, Tweet.created_at)
    if sort_order.lower() == "asc":
        q = q.order_by(asc(sort_col))
    else:
        q = q.order_by(desc(sort_col))

    offset = (page - 1) * limit
    items = q.offset(offset).limit(limit).all()

    total_pages = math.ceil(total / limit) if total > 0 else 1

    return PaginatedTweetsResponse(
        items=[TweetResponse(**t.to_dict()) for t in items],
        total=total,
        page=page,
        limit=limit,
        totalPages=total_pages,
        hasNext=page < total_pages,
        hasPrev=page > 1
    )

@router.post("/classify", response_model=ClassifyResponse)
def classify_text(req: ClassifyRequest):
    """Ad-hoc text sentiment classification without saving to DB"""
    result = nlp_service.classify(req.text)
    return ClassifyResponse(
        sentiment=result["sentiment"],
        confidence=result["confidence"],
        scores=result["scores"],
        engine=result["engine"],
        cleaned_text=result["cleaned_text"],
        keywords=result["keywords"],
        hashtags=result["hashtags"]
    )

@router.post("/ingest", response_model=TweetResponse, status_code=status.HTTP_201_CREATED)
async def ingest_tweet(tweet_in: TweetCreate, db: Session = Depends(get_db)):
    """Ingest a tweet, analyze sentiment, store in DB, and broadcast via WebSocket"""
    result = nlp_service.classify(tweet_in.text)
    
    # Combine hashtags
    tags = list(set(result["hashtags"]))

    tweet = Tweet(
        tweet_id=tweet_in.tweet_id,
        author=tweet_in.author or "user",
        text=tweet_in.text,
        lang=tweet_in.lang or "en",
        created_at=tweet_in.created_at or datetime.now(timezone.utc),
        hashtags=tags,
        sentiment=result["sentiment"],
        confidence=result["confidence"],
        source=tweet_in.source or "manual",
        ingested_at=datetime.now(timezone.utc)
    )
    db.add(tweet)
    db.commit()
    db.refresh(tweet)

    tweet_data = tweet.to_dict()

    # Broadcast to WebSocket clients
    await manager.broadcast({
        "type": "NEW_TWEET",
        "data": tweet_data,
        "timestamp": datetime.now(timezone.utc).isoformat()
    })

    return TweetResponse(**tweet_data)

@router.post("/live-sample", response_model=TweetResponse)
async def trigger_live_sample(db: Session = Depends(get_db)):
    """Triggers an ingested sample tweet and broadcasts live via WebSocket"""
    mock = twitter_service.generate_mock_tweet()
    result = nlp_service.classify(mock["text"])

    tweet = Tweet(
        tweet_id=mock["tweet_id"],
        author=mock["author"],
        text=mock["text"],
        lang=mock["lang"],
        created_at=datetime.fromisoformat(mock["created_at"]),
        hashtags=mock.get("hashtags", []),
        sentiment=result["sentiment"],
        confidence=result["confidence"],
        source="live_stream",
        ingested_at=datetime.now(timezone.utc)
    )
    db.add(tweet)
    db.commit()
    db.refresh(tweet)

    tweet_dict = tweet.to_dict()

    await manager.broadcast({
        "type": "NEW_TWEET",
        "data": tweet_dict,
        "timestamp": datetime.now(timezone.utc).isoformat()
    })

    return TweetResponse(**tweet_dict)

@router.get("/{id}", response_model=TweetResponse)
def get_tweet(id: str, db: Session = Depends(get_db)):
    tweet = db.query(Tweet).filter(or_(Tweet.id == id, Tweet.tweet_id == id)).first()
    if not tweet:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tweet not found")
    return TweetResponse(**tweet.to_dict())

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_tweet(id: str, db: Session = Depends(get_db)):
    tweet = db.query(Tweet).filter(or_(Tweet.id == id, Tweet.tweet_id == id)).first()
    if not tweet:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tweet not found")
    db.delete(tweet)
    db.commit()
    return None
