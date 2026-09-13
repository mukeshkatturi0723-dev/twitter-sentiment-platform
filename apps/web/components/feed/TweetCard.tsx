import React from "react";
import { Tweet } from "@/lib/api-client";
import { SentimentBadge } from "@/components/ui/Badge";
import { timeAgo } from "@/lib/utils";
import { Twitter, Sparkles, MessageCircle, Heart, Share2 } from "lucide-react";

interface TweetCardProps {
  tweet: Tweet;
  isNew?: boolean;
}

export const TweetCard: React.FC<TweetCardProps> = ({ tweet, isNew = false }) => {
  const authorInitial = tweet.author ? tweet.author.charAt(0).toUpperCase() : "U";

  // Generate deterministic gradient for author
  const gradients = [
    "from-blue-500 to-indigo-600",
    "from-purple-500 to-pink-600",
    "from-emerald-500 to-teal-600",
    "from-amber-500 to-orange-600",
  ];
  const charCode = tweet.author.charCodeAt(0) || 0;
  const gradient = gradients[charCode % gradients.length];

  return (
    <div
      className={`glass-panel-interactive rounded-xl p-4 transition-all duration-200 ${
        isNew ? "ring-1 ring-indigo-500/50 bg-indigo-950/20" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-full bg-gradient-to-tr ${gradient} flex items-center justify-center text-white text-xs font-bold shrink-0 shadow`}
          >
            {authorInitial}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-white hover:underline cursor-pointer">
                @{tweet.author}
              </span>
              <span className="text-xs text-slate-500">· {timeAgo(tweet.created_at)}</span>
            </div>
            <div className="text-[11px] text-slate-400 capitalize">
              via {tweet.source.replace("_", " ")}
            </div>
          </div>
        </div>

        {/* Sentiment Badge */}
        <SentimentBadge sentiment={tweet.sentiment} confidence={tweet.confidence} />
      </div>

      {/* Tweet Body */}
      <p className="mt-3 text-sm text-slate-200 leading-relaxed font-normal whitespace-pre-wrap">
        {tweet.text}
      </p>

      {/* Hashtags */}
      {tweet.hashtags && tweet.hashtags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {tweet.hashtags.map((tag, idx) => (
            <span
              key={idx}
              className="text-xs text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer Metrics */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400">Confidence:</span>
          <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                tweet.sentiment === "positive"
                  ? "bg-emerald-400"
                  : tweet.sentiment === "negative"
                  ? "bg-rose-400"
                  : "bg-slate-400"
              }`}
              style={{ width: `${(tweet.confidence || 0.85) * 100}%` }}
            />
          </div>
          <span className="font-mono text-[10px]">
            {((tweet.confidence || 0.85) * 100).toFixed(0)}%
          </span>
        </div>

        <div className="flex items-center gap-4 text-slate-400">
          <button className="hover:text-slate-300 transition-colors">
            <MessageCircle className="w-3.5 h-3.5" />
          </button>
          <button className="hover:text-rose-400 transition-colors">
            <Heart className="w-3.5 h-3.5" />
          </button>
          <button className="hover:text-slate-300 transition-colors">
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
