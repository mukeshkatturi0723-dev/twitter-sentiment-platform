"use client";

import React, { useEffect, useState, useMemo } from "react";
import { api, AnalyticsSummary, KeywordItem, Tweet } from "@/lib/api-client";
import { useLiveStreamContext } from "../layout";
import { TwitterComposer } from "@/components/feed/TwitterComposer";
import { TweetCard } from "@/components/feed/TweetCard";
import { TwitterRightBar } from "@/components/feed/TwitterRightBar";
import { Sparkles, RefreshCw, Radio, X } from "lucide-react";

type SentimentTab = "for_you" | "positive" | "negative" | "neutral";

export default function DashboardPage() {
  const { isConnected, latestTweet } = useLiveStreamContext();
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [keywords, setKeywords] = useState<KeywordItem[]>([]);
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [activeTab, setActiveTab] = useState<SentimentTab>("for_you");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadDashboardData = async () => {
    try {
      setIsRefreshing(true);
      const [sumRes, kwRes, tweetRes] = await Promise.all([
        api.getSummary(),
        api.getKeywords(12),
        api.getTweets({ limit: 40 })
      ]);

      setSummary(sumRes);
      setKeywords(kwRes);
      setTweets(tweetRes.items);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Handle incoming live websocket stream tweet
  useEffect(() => {
    if (latestTweet) {
      setTweets((prev) => [
        latestTweet,
        ...prev.filter((t) => t.id !== latestTweet.id).slice(0, 50)
      ]);
      api.getSummary().then(setSummary).catch(() => {});
    }
  }, [latestTweet]);

  // Handle local user compose & post
  const handleTweetPosted = (newTweet: Tweet) => {
    setTweets((prev) => [newTweet, ...prev]);
    api.getSummary().then(setSummary).catch(() => {});
  };

  // Filter tweets based on active tab and search query
  const filteredTweets = useMemo(() => {
    return tweets.filter((t) => {
      // Sentiment tab filter
      if (activeTab === "positive" && t.sentiment !== "positive") return false;
      if (activeTab === "negative" && t.sentiment !== "negative") return false;
      if (activeTab === "neutral" && t.sentiment !== "neutral") return false;

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesText = t.text.toLowerCase().includes(query);
        const matchesAuthor = t.author.toLowerCase().includes(query);
        const matchesHashtags = t.hashtags && t.hashtags.some((h) => h.toLowerCase().includes(query));
        return matchesText || matchesAuthor || matchesHashtags;
      }

      return true;
    });
  }, [tweets, activeTab, searchQuery]);

  return (
    <div className="flex flex-1 min-w-0 justify-center">
      {/* Center Feed Column */}
      <div className="flex-1 min-w-0 max-w-[660px] border-r border-[#2f3336] min-h-screen">
        {/* Sticky Twitter Home Header */}
        <div className="sticky top-0 z-30 bg-black/80 backdrop-blur-md border-b border-[#2f3336]">
          <div className="flex items-center justify-between px-4 py-3">
            <h1 className="text-xl font-bold text-white tracking-tight">Home</h1>

            <div className="flex items-center gap-3">
              {/* WebSocket Live Indicator */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#16181c] border border-[#2f3336] text-[11px] text-neutral-400">
                <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-[#00ba7c] animate-pulse" : "bg-amber-400"}`} />
                <span className="hidden sm:inline">{isConnected ? "Live Stream" : "Connecting"}</span>
              </div>

              {/* Refresh Button */}
              <button
                onClick={loadDashboardData}
                disabled={isRefreshing}
                title="Refresh feed"
                className="p-1.5 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-[#1d9bf0]" : ""}`} />
              </button>
            </div>
          </div>

          {/* Twitter Tab Navigation: For You / Positive / Negative / Neutral */}
          <nav className="flex border-t border-[#2f3336]/60 text-sm font-medium">
            <button
              onClick={() => setActiveTab("for_you")}
              className={`flex-1 py-3.5 text-center transition-colors relative hover:bg-white/[0.03] cursor-pointer ${
                activeTab === "for_you" ? "text-white font-bold" : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              <span>For You</span>
              {activeTab === "for_you" && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#1d9bf0] rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab("positive")}
              className={`flex-1 py-3.5 text-center transition-colors relative hover:bg-white/[0.03] cursor-pointer ${
                activeTab === "positive" ? "text-[#00ba7c] font-bold" : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              <span>Positive</span>
              {activeTab === "positive" && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#00ba7c] rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab("negative")}
              className={`flex-1 py-3.5 text-center transition-colors relative hover:bg-white/[0.03] cursor-pointer ${
                activeTab === "negative" ? "text-[#f91880] font-bold" : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              <span>Negative</span>
              {activeTab === "negative" && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#f91880] rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab("neutral")}
              className={`flex-1 py-3.5 text-center transition-colors relative hover:bg-white/[0.03] cursor-pointer ${
                activeTab === "neutral" ? "text-neutral-200 font-bold" : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              <span>Neutral</span>
              {activeTab === "neutral" && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-neutral-400 rounded-full" />
              )}
            </button>
          </nav>
        </div>

        {/* Twitter Composer: "What is happening?!" input box */}
        <TwitterComposer onTweetPosted={handleTweetPosted} />

        {/* Active Search / Filter Banner */}
        {searchQuery && (
          <div className="p-3 bg-[#16181c] border-b border-[#2f3336] flex items-center justify-between text-xs text-neutral-300">
            <span>
              Searching for: <strong className="text-white">&ldquo;{searchQuery}&rdquo;</strong> ({filteredTweets.length} results)
            </span>
            <button
              onClick={() => setSearchQuery("")}
              className="flex items-center gap-1 text-[#1d9bf0] hover:underline"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear search</span>
            </button>
          </div>
        )}

        {/* Tweets Feed Stream */}
        <div className="divide-y divide-[#2f3336]">
          {isLoading ? (
            <div className="p-12 text-center text-neutral-500 space-y-3">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#1d9bf0]" />
              <p className="text-sm">Loading Twitter sentiment feed...</p>
            </div>
          ) : filteredTweets.length === 0 ? (
            <div className="p-12 text-center text-neutral-500 space-y-3">
              <p className="text-base text-neutral-400 font-medium">No tweets found</p>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                {searchQuery
                  ? "Try changing your search query or clear the search filter."
                  : "No tweets in this sentiment category yet. Use the composer above to analyze and post a tweet!"}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="px-4 py-1.5 rounded-full bg-[#16181c] hover:bg-[#202327] text-sm text-[#1d9bf0] border border-[#2f3336] transition-colors"
                >
                  Clear filter
                </button>
              )}
            </div>
          ) : (
            filteredTweets.map((tweet) => (
              <TweetCard
                key={tweet.id}
                tweet={tweet}
                isNew={latestTweet ? latestTweet.id === tweet.id : false}
              />
            ))
          )}
        </div>
      </div>

      {/* Right Column: Search, Minimal Sentiment Pulse Dashboard Widget, Trends */}
      <TwitterRightBar
        summary={summary}
        keywords={keywords}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSelectKeyword={(kw) => setSearchQuery(kw)}
        activeFilter={activeTab}
        onFilterChange={(tab) => setActiveTab(tab as SentimentTab)}
      />
    </div>
  );
}
