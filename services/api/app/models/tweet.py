import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, Float, DateTime, JSON
from services.api.app.db.session import Base

def generate_uuid() -> str:
    return str(uuid.uuid4())

class Tweet(Base):
    __tablename__ = "tweets"

    id = Column(String(36), primary_key=True, default=generate_uuid, index=True)
    tweet_id = Column(String(64), unique=True, index=True, nullable=True)
    author = Column(String(128), index=True, default="anonymous")
    text = Column(Text, nullable=False)
    lang = Column(String(16), default="en")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)
    hashtags = Column(JSON, default=list)  # JSON list of hashtags
    sentiment = Column(String(16), index=True, nullable=False)  # 'positive', 'negative', 'neutral'
    confidence = Column(Float, default=0.0)
    source = Column(String(32), default="manual")  # 'live_stream', 'upload', 'manual'
    ingested_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)

    def to_dict(self):
        return {
            "id": self.id,
            "tweet_id": self.tweet_id or self.id,
            "author": self.author,
            "text": self.text,
            "lang": self.lang,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "hashtags": self.hashtags or [],
            "sentiment": self.sentiment,
            "confidence": round(float(self.confidence), 4) if self.confidence else 0.0,
            "source": self.source,
            "ingested_at": self.ingested_at.isoformat() if self.ingested_at else None
        }
