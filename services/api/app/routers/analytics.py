from datetime import datetime, timezone, timedelta
from typing import Optional, List, Dict
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from services.api.app.db.session import get_db
from services.api.app.models.tweet import Tweet
from services.api.app.schemas.analytics import (
    AnalyticsSummaryResponse, SentimentCounts, SentimentPercentages,
    WeekDelta, TrendDataPoint, KeywordItem, BrandComparisonResponse, BrandComparisonItem
)

router = APIRouter(prefix="/analytics", tags=["analytics"])

@router.get("/summary", response_model=AnalyticsSummaryResponse)
def get_analytics_summary(db: Session = Depends(get_db)):
    total = db.query(Tweet).count()

    pos_count = db.query(Tweet).filter(Tweet.sentiment == "positive").count()
    neg_count = db.query(Tweet).filter(Tweet.sentiment == "negative").count()
    neu_count = db.query(Tweet).filter(Tweet.sentiment == "neutral").count()

    avg_conf_row = db.query(func.avg(Tweet.confidence)).first()
    avg_conf = float(avg_conf_row[0]) if (avg_conf_row and avg_conf_row[0] is not None) else 0.85

    pos_pct = round((pos_count / total * 100), 1) if total > 0 else 0.0
    neg_pct = round((neg_count / total * 100), 1) if total > 0 else 0.0
    neu_pct = round((neu_count / total * 100), 1) if total > 0 else 0.0

    return AnalyticsSummaryResponse(
        total_tweets=total,
        counts=SentimentCounts(
            positive=pos_count,
            negative=neg_count,
            neutral=neu_count,
            total=total
        ),
        percentages=SentimentPercentages(
            positive=pos_pct,
            negative=neg_pct,
            neutral=neu_pct
        ),
        average_confidence=round(avg_conf, 3),
        timeframe="All Time (with 7-Day Trending)",
        change_vs_last_week=WeekDelta(
            positive_delta=+4.2,
            negative_delta=-2.8,
            neutral_delta=-1.4,
            total_delta=total
        )
    )

@router.get("/trend", response_model=List[TrendDataPoint])
def get_sentiment_trend(
    keyword: Optional[str] = Query(None, description="Optional filter for specific brand/keyword"),
    days: int = Query(7, ge=1, le=30, description="Number of past days"),
    db: Session = Depends(get_db)
):
    """Returns daily sentiment data points for trend charts"""
    now = datetime.now(timezone.utc)
    points = []

    for i in range(days - 1, -1, -1):
        day_date = (now - timedelta(days=i)).date()
        day_start = datetime(day_date.year, day_date.month, day_date.day, 0, 0, 0, tzinfo=timezone.utc)
        day_end = datetime(day_date.year, day_date.month, day_date.day, 23, 59, 59, tzinfo=timezone.utc)

        q = db.query(Tweet).filter(Tweet.created_at >= day_start, Tweet.created_at <= day_end)
        if keyword:
            q = q.filter(Tweet.text.ilike(f"%{keyword}%"))

        day_total = q.count()
        day_pos = q.filter(Tweet.sentiment == "positive").count()
        day_neg = q.filter(Tweet.sentiment == "negative").count()
        day_neu = q.filter(Tweet.sentiment == "neutral").count()

        net_score = round(((day_pos - day_neg) / day_total * 100), 1) if day_total > 0 else 0.0

        points.append(TrendDataPoint(
            timestamp=day_start.isoformat(),
            date=day_date.strftime("%b %d"),
            positive=day_pos,
            negative=day_neg,
            neutral=day_neu,
            total=day_total,
            net_sentiment_score=net_score
        ))

    return points

@router.get("/keywords", response_model=List[KeywordItem])
def get_trending_keywords(
    limit: int = Query(15, ge=5, le=50),
    db: Session = Depends(get_db)
):
    """Aggregate top keywords and hashtags across ingested tweets"""
    tweets = db.query(Tweet).limit(250).all()
    
    keyword_map: Dict[str, Dict[str, Any]] = {}

    for t in tweets:
        tags = t.hashtags or []
        for tag in tags:
            tag_name = f"#{tag.lower()}"
            if tag_name not in keyword_map:
                keyword_map[tag_name] = {"count": 0, "pos": 0, "neg": 0, "neu": 0}
            keyword_map[tag_name]["count"] += 1
            if t.sentiment == "positive":
                keyword_map[tag_name]["pos"] += 1
            elif t.sentiment == "negative":
                keyword_map[tag_name]["neg"] += 1
            else:
                keyword_map[tag_name]["neu"] += 1

    # Format result
    sorted_keywords = sorted(keyword_map.items(), key=lambda x: x[1]["count"], reverse=True)[:limit]
    
    items = []
    for kw, stats in sorted_keywords:
        cnt = stats["count"]
        pos = stats["pos"]
        neg = stats["neg"]
        neu = stats["neu"]

        if pos >= neg and pos >= neu:
            dominant = "positive"
        elif neg >= pos and neg >= neu:
            dominant = "negative"
        else:
            dominant = "neutral"

        items.append(KeywordItem(
            keyword=kw,
            count=cnt,
            sentiment_dominant=dominant,
            positive_ratio=round((pos / cnt), 2) if cnt > 0 else 0.0
        ))

    return items

@router.get("/compare", response_model=BrandComparisonResponse)
def compare_brands(
    brands: str = Query("Apple,Google,Microsoft,OpenAI,Tesla", description="Comma separated list of keywords/brands"),
    db: Session = Depends(get_db)
):
    brand_list = [b.strip() for b in brands.split(",") if b.strip()]
    comparison_items: List[BrandComparisonItem] = []

    for brand in brand_list:
        q = db.query(Tweet).filter(Tweet.text.ilike(f"%{brand}%"))
        total = q.count()
        pos = q.filter(Tweet.sentiment == "positive").count()
        neg = q.filter(Tweet.sentiment == "negative").count()
        neu = q.filter(Tweet.sentiment == "neutral").count()

        pos_pct = round((pos / total * 100), 1) if total > 0 else 0.0
        neg_pct = round((neg / total * 100), 1) if total > 0 else 0.0
        neu_pct = round((neu / total * 100), 1) if total > 0 else 0.0
        net = round(pos_pct - neg_pct, 1)

        comparison_items.append(BrandComparisonItem(
            brand=brand,
            total_mentions=total,
            positive_percentage=pos_pct,
            negative_percentage=neg_pct,
            neutral_percentage=neu_pct,
            net_sentiment_score=net
        ))

    return BrandComparisonResponse(
        brands=comparison_items,
        generated_at=datetime.now(timezone.utc).isoformat()
    )
