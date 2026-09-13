from typing import List, Dict
from pydantic import BaseModel

class SentimentCounts(BaseModel):
    positive: int
    negative: int
    neutral: int
    total: int

class SentimentPercentages(BaseModel):
    positive: float
    negative: float
    neutral: float

class WeekDelta(BaseModel):
    positive_delta: float
    negative_delta: float
    neutral_delta: float
    total_delta: int

class AnalyticsSummaryResponse(BaseModel):
    total_tweets: int
    counts: SentimentCounts
    percentages: SentimentPercentages
    average_confidence: float
    timeframe: str
    change_vs_last_week: WeekDelta

class TrendDataPoint(BaseModel):
    timestamp: str
    date: str
    positive: int
    negative: int
    neutral: int
    total: int
    net_sentiment_score: float

class KeywordItem(BaseModel):
    keyword: str
    count: int
    sentiment_dominant: str
    positive_ratio: float

class BrandComparisonItem(BaseModel):
    brand: str
    total_mentions: int
    positive_percentage: float
    negative_percentage: float
    neutral_percentage: float
    net_sentiment_score: float

class BrandComparisonResponse(BaseModel):
    brands: List[BrandComparisonItem]
    generated_at: str
