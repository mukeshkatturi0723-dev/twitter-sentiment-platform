"use client";

import React, { useEffect, useState } from "react";
import { api, AnalyticsSummary, TrendPoint, KeywordItem, Tweet } from "@/lib/api-client";
import { useLiveStreamContext } from "../layout";
import { StatCard } from "@/components/ui/StatCard";
import { LiveTweetTicker } from "@/components/feed/LiveTweetTicker";
import { TweetCard } from "@/components/feed/TweetCard";
import { AdHocClassifier } from "@/components/feed/AdHocClassifier";
import { TrendLineChart } from "@/components/charts/TrendLineChart";
import { SentimentDonutChart } from "@/components/charts/SentimentDonutChart";
import { KeywordCloud } from "@/components/charts/KeywordCloud";
import {
  Activity,
  Smile,
  Frown,
  Meh,
  RefreshCw,
  Hash,
  Radio,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { isConnected, latestTweet } = useLiveStreamContext();
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [trendData, setTrendData] = useState<TrendPoint[]>([]);
  const [keywords, setKeywords] = useState<KeywordItem[]>([]);
  const [recentTweets, setRecentTweets] = useState<Tweet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const [sumRes, trendRes, kwRes, tweetRes] = await Promise.all([
        api.getSummary(),
        api.getTrend(undefined, 7),
        api.getKeywords(14),
        api.getTweets({ limit: 6, sort_by: "created_at", sort_order: "desc" })
      ]);

      setSummary(sumRes);
      setTrendData(trendRes);
      setKeywords(kwRes);
      setRecentTweets(tweetRes.items);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // When a live tweet arrives on WebSocket, prepend to feed and increment counts
  useEffect(() => {
    if (latestTweet) {
      setRecentTweets((prev) => [latestTweet, ...prev.filter((t) => t.id !== latestTweet.id).slice(0, 5)]);
      // Refresh summary softly
      api.getSummary().then(setSummary).catch(() => {});
    }
  }, [latestTweet]);

  return (
    <div className="space-y-6">
      {/* Live Ticker */}
      <LiveTweetTicker latestTweet={latestTweet} isConnected={isConnected} />

      {/* Top Section / Header Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Sentiment Overview</h2>
          <p className="text-xs text-slate-400">
            Real-time multi-tier NLP sentiment intelligence and streaming tweet monitoring
          </p>
        </div>

        <button
          onClick={loadDashboardData}
          disabled={isLoading}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-slate-400 ${isLoading ? "animate-spin" : ""}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Ingested Tweets"
          value={summary ? summary.total_tweets.toLocaleString() : "..."}
          subtitle="Processed by NLP"
          change={summary?.change_vs_last_week.total_delta ? 12.5 : 0}
          changeLabel="new this week"
          icon={<Activity className="w-5 h-5" />}
          variant="default"
        />
        <StatCard
          title="Positive Sentiment"
          value={summary ? `${summary.percentages.positive}%` : "..."}
          subtitle={summary ? `${summary.counts.positive} tweets` : ""}
          change={summary?.change_vs_last_week.positive_delta || 4.2}
          icon={<Smile className="w-5 h-5" />}
          variant="positive"
        />
        <StatCard
          title="Negative Sentiment"
          value={summary ? `${summary.percentages.negative}%` : "..."}
          subtitle={summary ? `${summary.counts.negative} tweets` : ""}
          change={summary?.change_vs_last_week.negative_delta || -2.8}
          icon={<Frown className="w-5 h-5" />}
          variant="negative"
        />
        <StatCard
          title="Neutral / Objective"
          value={summary ? `${summary.percentages.neutral}%` : "..."}
          subtitle={summary ? `Avg Conf: ${(summary.average_confidence * 100).toFixed(0)}%` : ""}
          change={summary?.change_vs_last_week.neutral_delta || -1.4}
          icon={<Meh className="w-5 h-5" />}
          variant="neutral"
        />
      </div>

      {/* Main Charts Section: Trend Line + Radial Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Sentiment Volume Timeline</h3>
              <p className="text-xs text-slate-400">Daily breakdown of positive, neutral, and negative tweets</p>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-mono">
              Last 7 Days
            </span>
          </div>

          <TrendLineChart data={trendData} />
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Sentiment Ratio</h3>
              <p className="text-xs text-slate-400">Overall class distribution</p>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 font-mono">
              3-Class
            </span>
          </div>

          <SentimentDonutChart
            positive={summary ? summary.counts.positive : 0}
            negative={summary ? summary.counts.negative : 0}
            neutral={summary ? summary.counts.neutral : 0}
          />
        </div>
      </div>

      {/* Ad-Hoc NLP Classifier & Keywords Cloud Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real-time Classifier Input Box */}
        <AdHocClassifier onIngestSuccess={loadDashboardData} />

        {/* Trending Hashtag Cloud */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <Hash className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Trending Topics & Entities</h3>
                <p className="text-xs text-slate-400">Hashtags colored by sentiment dominance</p>
              </div>
            </div>

            <Link
              href="/analytics"
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
            >
              <span>Compare</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <KeywordCloud keywords={keywords} />
        </div>
      </div>

      {/* Latest Ingested Tweets Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-white">Live Ingestion Stream</h3>
            <span className="text-xs text-slate-400">({recentTweets.length} recent)</span>
          </div>

          <Link
            href="/search"
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium transition-colors"
          >
            <span>View All in Explorer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentTweets.map((tweet) => (
            <TweetCard
              key={tweet.id}
              tweet={tweet}
              isNew={latestTweet ? latestTweet.id === tweet.id : false}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
