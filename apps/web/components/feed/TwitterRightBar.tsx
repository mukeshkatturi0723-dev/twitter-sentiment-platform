"use client";

import React, { useState } from "react";
import { AnalyticsSummary, KeywordItem } from "@/lib/api-client";
import { Search, TrendingUp, Sparkles, Activity, Smile, Frown, Meh, ArrowUpRight } from "lucide-react";

interface TwitterRightBarProps {
  summary: AnalyticsSummary | null;
  keywords: KeywordItem[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectKeyword?: (kw: string) => void;
  activeFilter?: string;
  onFilterChange?: (filter: string) => void;
}

export const TwitterRightBar: React.FC<TwitterRightBarProps> = ({
  summary,
  keywords,
  searchQuery,
  onSearchChange,
  onSelectKeyword,
  activeFilter = "all",
  onFilterChange
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const posPct = summary ? summary.percentages.positive : 54;
  const negPct = summary ? summary.percentages.negative : 18;
  const neuPct = summary ? summary.percentages.neutral : 28;
  const totalCount = summary ? summary.total_tweets : 0;
  const avgConf = summary ? (summary.average_confidence * 100).toFixed(0) : "88";

  // Fallback trending topics if keywords are loading
  const displayTrends = keywords && keywords.length > 0
    ? keywords.slice(0, 5)
    : [
        { keyword: "AI", count: 1420, sentiment_dominant: "positive" as const, positive_ratio: 0.88 },
        { keyword: "NVIDIA", count: 980, sentiment_dominant: "positive" as const, positive_ratio: 0.91 },
        { keyword: "CustomerService", count: 650, sentiment_dominant: "negative" as const, positive_ratio: 0.22 },
        { keyword: "FedRate", count: 430, sentiment_dominant: "neutral" as const, positive_ratio: 0.45 },
        { keyword: "Productivity", count: 390, sentiment_dominant: "positive" as const, positive_ratio: 0.82 },
      ];

  return (
    <aside className="w-80 shrink-0 hidden lg:flex flex-col gap-4 py-3 px-4 sticky top-0 h-screen overflow-y-auto border-l border-[#2f3336]">
      {/* 1. Search Bar */}
      <div
        className={`flex items-center gap-3 px-4 py-2.5 rounded-full bg-[#16181c] border transition-all ${
          isSearchFocused
            ? "border-[#1d9bf0] ring-1 ring-[#1d9bf0] bg-black"
            : "border-transparent text-neutral-400"
        }`}
      >
        <Search className={`w-4 h-4 shrink-0 ${isSearchFocused ? "text-[#1d9bf0]" : "text-neutral-500"}`} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
          placeholder="Search tweets or #hashtags..."
          className="bg-transparent border-none outline-none text-sm text-white placeholder-neutral-500 w-full focus:ring-0 p-0"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="text-xs text-neutral-500 hover:text-white"
          >
            &times;
          </button>
        )}
      </div>

      {/* 2. Minimal Dashboard Widget: Sentiment Pulse */}
      <div className="rounded-2xl bg-[#16181c] border border-[#2f3336] p-4 space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#1d9bf0]" />
            <h3 className="font-bold text-white text-sm">Sentiment Pulse</h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#00ba7c]/10 text-[#00ba7c] border border-[#00ba7c]/20">
            Live {avgConf}% Conf
          </span>
        </div>

        {/* Minimal Stats Row */}
        <div className="grid grid-cols-3 gap-2 text-center pt-1">
          <div
            onClick={() => onFilterChange && onFilterChange(activeFilter === "positive" ? "all" : "positive")}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              activeFilter === "positive"
                ? "bg-[#00ba7c]/15 border-[#00ba7c] text-white"
                : "bg-black/30 border-[#2f3336] hover:border-neutral-600"
            }`}
          >
            <div className="flex items-center justify-center gap-1 text-[11px] text-[#00ba7c]">
              <Smile className="w-3 h-3" />
              <span>Positive</span>
            </div>
            <div className="text-base font-extrabold text-white mt-0.5">{posPct}%</div>
            <div className="text-[10px] text-neutral-400">
              {summary ? summary.counts.positive : 0} tweets
            </div>
          </div>

          <div
            onClick={() => onFilterChange && onFilterChange(activeFilter === "negative" ? "all" : "negative")}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              activeFilter === "negative"
                ? "bg-[#f91880]/15 border-[#f91880] text-white"
                : "bg-black/30 border-[#2f3336] hover:border-neutral-600"
            }`}
          >
            <div className="flex items-center justify-center gap-1 text-[11px] text-[#f91880]">
              <Frown className="w-3 h-3" />
              <span>Negative</span>
            </div>
            <div className="text-base font-extrabold text-white mt-0.5">{negPct}%</div>
            <div className="text-[10px] text-neutral-400">
              {summary ? summary.counts.negative : 0} tweets
            </div>
          </div>

          <div
            onClick={() => onFilterChange && onFilterChange(activeFilter === "neutral" ? "all" : "neutral")}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              activeFilter === "neutral"
                ? "bg-neutral-500/15 border-neutral-400 text-white"
                : "bg-black/30 border-[#2f3336] hover:border-neutral-600"
            }`}
          >
            <div className="flex items-center justify-center gap-1 text-[11px] text-neutral-400">
              <Meh className="w-3 h-3" />
              <span>Neutral</span>
            </div>
            <div className="text-base font-extrabold text-white mt-0.5">{neuPct}%</div>
            <div className="text-[10px] text-neutral-400">
              {summary ? summary.counts.neutral : 0} tweets
            </div>
          </div>
        </div>

        {/* Proportional Ratio Bar */}
        <div className="space-y-1">
          <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden flex">
            <div
              className="bg-[#00ba7c] h-full transition-all duration-500"
              style={{ width: `${posPct}%` }}
              title={`Positive: ${posPct}%`}
            />
            <div
              className="bg-[#71767b] h-full transition-all duration-500"
              style={{ width: `${neuPct}%` }}
              title={`Neutral: ${neuPct}%`}
            />
            <div
              className="bg-[#f91880] h-full transition-all duration-500"
              style={{ width: `${negPct}%` }}
              title={`Negative: ${negPct}%`}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-0.5">
            <span>Total: <strong className="text-white">{totalCount.toLocaleString()}</strong> processed</span>
            <span>Ratio distribution</span>
          </div>
        </div>
      </div>

      {/* 3. Trends For You */}
      <div className="rounded-2xl bg-[#16181c] border border-[#2f3336] p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white text-sm">Trends for you</h3>
          <TrendingUp className="w-4 h-4 text-neutral-500" />
        </div>

        <div className="divide-y divide-[#2f3336]/60">
          {displayTrends.map((trend, idx) => (
            <div
              key={idx}
              onClick={() => onSelectKeyword && onSelectKeyword(trend.keyword)}
              className="py-2.5 first:pt-1 last:pb-0 hover:bg-white/[0.03] -mx-2 px-2 rounded-lg transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between text-[11px] text-neutral-500">
                <span>Trending · Technology</span>
                <span
                  className={`px-1.5 py-0.2 rounded font-medium text-[10px] ${
                    trend.sentiment_dominant === "positive"
                      ? "bg-[#00ba7c]/10 text-[#00ba7c]"
                      : trend.sentiment_dominant === "negative"
                      ? "bg-[#f91880]/10 text-[#f91880]"
                      : "bg-neutral-800 text-neutral-400"
                  }`}
                >
                  {trend.sentiment_dominant === "positive"
                    ? "Mostly Positive"
                    : trend.sentiment_dominant === "negative"
                    ? "Critical / Negative"
                    : "Neutral"}
                </span>
              </div>
              <div className="font-bold text-white text-[14px] group-hover:text-[#1d9bf0] transition-colors flex items-center justify-between mt-0.5">
                <span>#{trend.keyword}</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#1d9bf0]" />
              </div>
              <div className="text-[11px] text-neutral-500">
                {trend.count.toLocaleString()} tweets
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Footer Mini Links */}
      <div className="text-[11px] text-neutral-500 px-2 space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <a href="/about" className="hover:underline">About</a>
          <span>·</span>
          <a href="/how-it-works" className="hover:underline">Methodology</a>
          <span>·</span>
          <a href="/settings" className="hover:underline">Settings</a>
          <span>·</span>
          <a href="/model" className="hover:underline">Model</a>
        </div>
        <p>© 2026 Sentix AI Platform</p>
      </div>
    </aside>
  );
};
