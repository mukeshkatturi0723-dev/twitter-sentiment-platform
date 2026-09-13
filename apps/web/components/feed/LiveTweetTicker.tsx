import React from "react";
import { Tweet } from "@/lib/api-client";
import { SentimentBadge } from "@/components/ui/Badge";
import { Radio, Zap } from "lucide-react";

interface LiveTweetTickerProps {
  latestTweet: Tweet | null;
  isConnected: boolean;
}

export const LiveTweetTicker: React.FC<LiveTweetTickerProps> = ({
  latestTweet,
  isConnected
}) => {
  if (!latestTweet) {
    return (
      <div className="glass-panel rounded-xl px-4 py-3 flex items-center justify-between border border-slate-800 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-indigo-400 animate-pulse" />
          <span>Live Ticker: Listening for streaming tweets on WebSocket...</span>
        </div>
        <span className="text-[11px] text-slate-500">Auto-updates on incoming tweets</span>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-xl px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border border-indigo-500/30 bg-indigo-950/20 shadow-lg shadow-indigo-950/40 animate-fade-in-up">
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
            Incoming Tweet
          </span>
        </div>
        
        <span className="text-xs text-slate-400 shrink-0 font-medium">@{latestTweet.author}:</span>
        
        <p className="text-xs text-slate-200 truncate max-w-xl font-normal">
          &ldquo;{latestTweet.text}&rdquo;
        </p>
      </div>

      <div className="shrink-0 flex items-center gap-2 self-end sm:self-center">
        <SentimentBadge sentiment={latestTweet.sentiment} confidence={latestTweet.confidence} size="sm" />
      </div>
    </div>
  );
};
