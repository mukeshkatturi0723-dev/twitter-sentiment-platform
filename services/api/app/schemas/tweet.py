from typing import Optional, List, Literal
from datetime import datetime
from pydantic import BaseModel, Field

SentimentEnum = Literal["positive", "negative", "neutral"]

class TweetBase(BaseModel):
    text: str = Field(..., min_length=1, description="Tweet raw text content")
    author: Optional[str] = Field("anonymous", description="Author username or handle")
    lang: Optional[str] = Field("en", description="Language code")
    source: Optional[str] = Field("manual", description="Source: live_stream | upload | manual")

class TweetCreate(TweetBase):
    tweet_id: Optional[str] = None
    created_at: Optional[datetime] = None

class TweetResponse(BaseModel):
    id: str
    tweet_id: Optional[str]
    author: str
    text: str
    lang: str
    created_at: Optional[str]
    hashtags: List[str] = []
    sentiment: SentimentEnum
    confidence: float
    source: str
    ingested_at: Optional[str]

    class Config:
        from_attributes = True

class PaginatedTweets(BaseModel):
    items: List[TweetResponse]
    total: int
    page: int
    limit: int
    totalPages: int
    hasNext: bool = Field(False, alias="hasNext")
    hasPrev: bool = Field(False, alias="hasPrev")

    class Config:
        populate_by_name = True

# Workaround for boolean type in pydantic
class PaginatedTweetsResponse(BaseModel):
    items: List[TweetResponse]
    total: int
    page: int
    limit: int
    totalPages: int
    hasNext: bool
    hasPrev: bool

class ClassifyRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=1000)

class SentimentScoreBreakdown(BaseModel):
    positive: float
    negative: float
    neutral: float

class ClassifyResponse(BaseModel):
    sentiment: SentimentEnum
    confidence: float
    scores: SentimentScoreBreakdown
    engine: str
    cleaned_text: str
    keywords: List[str]
    hashtags: List[str]
