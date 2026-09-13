import csv
import io
from datetime import datetime, timezone
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from services.api.app.db.session import get_db
from services.api.app.models.tweet import Tweet
from services.api.app.services.nlp_service import nlp_service
from services.api.app.core.websocket import manager

router = APIRouter(prefix="/upload", tags=["upload"])

@router.post("", status_code=status.HTTP_200_OK)
async def upload_csv_batch(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    if not file.filename.endswith((".csv", ".txt")):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file format. Please upload a CSV file."
        )

    try:
        content = await file.read()
        text_content = content.decode("utf-8", errors="replace")
        csv_reader = csv.reader(io.StringIO(text_content))
        
        rows = list(csv_reader)
        if not rows:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="CSV file is empty.")

        # Determine header vs headerless
        first_row = [c.strip().lower() for c in rows[0]]
        has_header = any("text" in c or "tweet" in c or "content" in c for c in first_row)
        
        text_idx = 0
        author_idx = None
        created_at_idx = None

        start_row = 0
        if has_header:
            start_row = 1
            for i, col in enumerate(first_row):
                if col in ["text", "tweet", "content", "tweet_text"]:
                    text_idx = i
                elif col in ["author", "user", "username", "screen_name"]:
                    author_idx = i
                elif col in ["created_at", "date", "timestamp"]:
                    created_at_idx = i
        else:
            # If Sentiment140 format (target, ids, date, flag, user, text)
            if len(rows[0]) == 6:
                text_idx = 5
                author_idx = 4
                created_at_idx = 2
            else:
                text_idx = 0

        created_tweets: List[Dict[str, Any]] = []
        positive_count = 0
        negative_count = 0
        neutral_count = 0

        # Limit to 500 rows per batch upload for snappy synchronous processing
        max_batch = 500
        data_rows = rows[start_row:start_row + max_batch]

        new_tweet_models = []

        for row in data_rows:
            if not row or len(row) <= text_idx:
                continue
            
            raw_text = row[text_idx].strip()
            if not raw_text or len(raw_text) < 2:
                continue

            author = row[author_idx].strip() if (author_idx is not None and len(row) > author_idx) else "csv_uploader"
            
            # NLP Classification
            result = nlp_service.classify(raw_text)
            sentiment = result["sentiment"]
            confidence = result["confidence"]
            hashtags = result["hashtags"]

            if sentiment == "positive":
                positive_count += 1
            elif sentiment == "negative":
                negative_count += 1
            else:
                neutral_count += 1

            tweet_obj = Tweet(
                author=author,
                text=raw_text,
                lang="en",
                created_at=datetime.now(timezone.utc),
                hashtags=hashtags,
                sentiment=sentiment,
                confidence=confidence,
                source="upload",
                ingested_at=datetime.now(timezone.utc)
            )
            new_tweet_models.append(tweet_obj)

        if new_tweet_models:
            db.bulk_save_objects(new_tweet_models)
            db.commit()

        total_processed = len(new_tweet_models)

        # Broadcast WebSocket summary update
        await manager.broadcast({
            "type": "SUMMARY_UPDATE",
            "message": f"Processed batch CSV with {total_processed} tweets",
            "timestamp": datetime.now(timezone.utc).isoformat()
        })

        return {
            "status": "success",
            "filename": file.filename,
            "total_processed": total_processed,
            "breakdown": {
                "positive": positive_count,
                "negative": negative_count,
                "neutral": neutral_count
            },
            "positive_percentage": round((positive_count / total_processed * 100), 1) if total_processed else 0,
            "negative_percentage": round((negative_count / total_processed * 100), 1) if total_processed else 0,
            "neutral_percentage": round((neutral_count / total_processed * 100), 1) if total_processed else 0,
            "preview": [
                {
                    "text": t.text[:120],
                    "author": t.author,
                    "sentiment": t.sentiment,
                    "confidence": t.confidence
                } for t in new_tweet_models[:10]
            ]
        }

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process CSV: {str(e)}"
        )
