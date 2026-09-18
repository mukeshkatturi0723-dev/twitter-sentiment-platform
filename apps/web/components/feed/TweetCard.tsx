"use client";

import React, { useState } from "react";
import { Tweet } from "@/lib/api-client";
import { SentimentBadge } from "@/components/ui/Badge";
import { timeAgo } from "@/lib/utils";
import {
  MessageCircle,
  Repeat2,
  Heart,
  Share,
  Sparkles,
  BarChart2,
  Check
} from "lucide-react";

interface TweetCardProps {
  tweet: Tweet;
  isNew?: boolean;
}

export const TweetCard: React.FC<TweetCardProps> = ({ tweet, isNew = false }) => {
  const [liked, setLiked] = useState(false);
  const [retweeted, setRetweeted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showConfidence, setShowConfidence] = useState(false);

  // Author initial and stable avatar color
  const author = tweet.author || "user";
  const authorInitial = author.charAt(0).toUpperCase();

  const gradients = [
    "from-[#1d9bf0] to-indigo-600",
    "from-purple-500 to-pink-600",
    "from-emerald-500 to-teal-600",
    "from-amber-500 to-orange-600",
  ];
  const charCode = author.charCodeAt(0) || 0;
  const gradient = gradients[charCode % gradients.length];

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(`"${tweet.text}" - via Sentix AI Sentiment Platform`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const confidencePct = ((tweet.confidence || 0.85) * 100).toFixed(0);

  return (
    <article
      className={`border-b border-[#2f3336] p-4 transition-colors hover:bg-white/[0.02] cursor-pointer ${
        isNew ? "bg-[#1d9bf0]/5 animate-fade-in" : ""
      }`}
    >
      <div className="flex gap-3">
        {/* Avatar */}
        <div
          className={`w-10 h-10 rounded-full bg-gradient-to-tr ${gradient} flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm`}
        >
          {authorInitial}
        </div>

        {/* Tweet Content */}
        <div className="flex-1 min-w-0">
          {/* Header row: Name, Handle, Timestamp, Sentiment Badge */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="font-bold text-white text-[15px] hover:underline truncate">
                {author}
              </span>
              <span className="text-neutral-500 text-sm truncate">
                @{author.toLowerCase().replace(/\s+/g, "_")}
              </span>
              <span className="text-neutral-500 text-sm">·</span>
              <span className="text-neutral-500 text-sm shrink-0">
                {timeAgo(tweet.created_at)}
              </span>
            </div>

            {/* Sentiment Badge on the right */}
            <div className="shrink-0">
              <SentimentBadge sentiment={tweet.sentiment} confidence={tweet.confidence} />
            </div>
          </div>

          {/* Tweet Text */}
          <p className="mt-1.5 text-[15px] text-neutral-100 leading-relaxed font-normal whitespace-pre-wrap break-words">
            {tweet.text}
          </p>

          {/* Hashtags */}
          {tweet.hashtags && tweet.hashtags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {tweet.hashtags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-sm text-[#1d9bf0] hover:underline cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Confidence & Source Info Bar (Toggled or inline) */}
          <div className="mt-2.5 flex items-center gap-3 text-xs text-neutral-500 font-mono">
            <span className="flex items-center gap-1">
              <span>Confidence:</span>
              <span
                className={`font-semibold ${
                  tweet.sentiment === "positive"
                    ? "text-[#00ba7c]"
                    : tweet.sentiment === "negative"
                    ? "text-[#f91880]"
                    : "text-neutral-300"
                }`}
              >
                {confidencePct}%
              </span>
            </span>
            <span>·</span>
            <span className="capitalize">{tweet.source.replace("_", " ")}</span>
          </div>

          {/* Twitter Action Row: Reply, Retweet, Like, Views/Confidence, Share */}
          <div className="mt-3 pt-2 border-t border-[#2f3336]/40 flex items-center justify-between max-w-md text-neutral-500 text-xs">
            {/* Reply */}
            <button
              type="button"
              className="flex items-center gap-1.5 hover:text-[#1d9bf0] transition-colors group"
            >
              <div className="p-1.5 rounded-full group-hover:bg-[#1d9bf0]/10">
                <MessageCircle className="w-4 h-4" />
              </div>
              <span className="text-xs">12</span>
            </button>

            {/* Retweet */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setRetweeted(!retweeted);
              }}
              className={`flex items-center gap-1.5 transition-colors group ${
                retweeted ? "text-[#00ba7c]" : "hover:text-[#00ba7c]"
              }`}
            >
              <div className="p-1.5 rounded-full group-hover:bg-[#00ba7c]/10">
                <Repeat2 className="w-4 h-4" />
              </div>
              <span className="text-xs">{retweeted ? "6" : "5"}</span>
            </button>

            {/* Like */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLiked(!liked);
              }}
              className={`flex items-center gap-1.5 transition-colors group ${
                liked ? "text-[#f91880]" : "hover:text-[#f91880]"
              }`}
            >
              <div className="p-1.5 rounded-full group-hover:bg-[#f91880]/10">
                <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
              </div>
              <span className="text-xs">{liked ? "29" : "28"}</span>
            </button>

            {/* Sentiment Analytics / Confidence */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowConfidence(!showConfidence);
              }}
              title="Confidence Score"
              className="flex items-center gap-1.5 hover:text-[#1d9bf0] transition-colors group"
            >
              <div className="p-1.5 rounded-full group-hover:bg-[#1d9bf0]/10">
                <BarChart2 className="w-4 h-4" />
              </div>
              <span className="text-xs">{confidencePct}%</span>
            </button>

            {/* Share */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleShare();
              }}
              title="Copy link / text"
              className="p-1.5 rounded-full hover:bg-[#1d9bf0]/10 hover:text-[#1d9bf0] transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-[#00ba7c]" /> : <Share className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
