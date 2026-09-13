export type SentimentType = 'positive' | 'negative' | 'neutral';

export interface SentimentConfidence {
  positive: number;
  negative: number;
  neutral: number;
}

export interface ClassificationResult {
  sentiment: SentimentType;
  confidence: number;
  scores: SentimentConfidence;
  engine: 'transformer' | 'vader' | 'hybrid';
  cleaned_text: string;
  keywords: string[];
  hashtags: string[];
}
