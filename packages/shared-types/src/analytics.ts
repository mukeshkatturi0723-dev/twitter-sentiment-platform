import { SentimentType } from './sentiment';

export interface SentimentCounts {
  positive: number;
  negative: number;
  neutral: number;
  total: number;
}

export interface SentimentPercentages {
  positive: number;
  negative: number;
  neutral: number;
}

export interface AnalyticsSummary {
  total_tweets: number;
  counts: SentimentCounts;
  percentages: SentimentPercentages;
  average_confidence: number;
  timeframe: string;
  change_vs_last_week: {
    positive_delta: number;
    negative_delta: number;
    neutral_delta: number;
    total_delta: number;
  };
}

export interface SentimentTrendPoint {
  timestamp: string;
  date: string;
  positive: number;
  negative: number;
  neutral: number;
  total: number;
  net_sentiment_score: number; // positive % minus negative %
}

export interface KeywordFrequency {
  keyword: string;
  count: number;
  sentiment_dominant: SentimentType;
  positive_ratio: number;
}

export interface BrandComparisonItem {
  brand: string;
  total_mentions: number;
  positive_percentage: number;
  negative_percentage: number;
  neutral_percentage: number;
  net_sentiment_score: number;
}

export interface BrandComparisonResponse {
  brands: BrandComparisonItem[];
  generated_at: string;
}
