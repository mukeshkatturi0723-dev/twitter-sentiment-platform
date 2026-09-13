import { Tweet } from './tweet';
import { AnalyticsSummary } from './analytics';

export type LiveFeedEventType = 'NEW_TWEET' | 'SUMMARY_UPDATE' | 'PING' | 'CONNECTED';

export interface LiveFeedEvent {
  type: LiveFeedEventType;
  data?: Tweet;
  summary?: AnalyticsSummary;
  timestamp: string;
  message?: string;
}
