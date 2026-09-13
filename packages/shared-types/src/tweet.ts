import { SentimentType } from './sentiment';

export interface Tweet {
  id: string;
  tweet_id: string;
  author: string;
  text: string;
  lang: string;
  created_at: string;
  hashtags: string[];
  sentiment: SentimentType;
  confidence: number;
  source: 'live_stream' | 'upload' | 'manual';
  ingested_at: string;
}

export interface TweetCreateInput {
  tweet_id?: string;
  author?: string;
  text: string;
  lang?: string;
  source?: 'live_stream' | 'upload' | 'manual';
}

export interface TweetFilterParams {
  query?: string;
  sentiment?: SentimentType | 'all';
  from?: string;
  to?: string;
  lang?: string;
  page?: number;
  limit?: number;
  sortBy?: 'created_at' | 'confidence' | 'ingested_at';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedTweetsResponse {
  items: Tweet[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}
