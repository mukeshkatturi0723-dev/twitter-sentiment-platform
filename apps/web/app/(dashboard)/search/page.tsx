"use client";

import React, { useState, useEffect } from "react";
import { api, Tweet, PaginatedTweets } from "@/lib/api-client";
import { TweetCard } from "@/components/feed/TweetCard";
import { SentimentBadge } from "@/components/ui/Badge";
import { timeAgo } from "@/lib/utils";
import {
  Search,
  Filter,
  ArrowUpDown,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Sparkles
} from "lucide-react";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [sentimentFilter, setSentimentFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [data, setData] = useState<PaginatedTweets | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTweets = async () => {
    try {
      setIsLoading(true);
      const res = await api.getTweets({
        query: query.trim() || undefined,
        sentiment: sentimentFilter !== "all" ? sentimentFilter : undefined,
        page,
        limit: 12,
        sort_by: sortBy,
        sort_order: sortOrder
      });
      setData(res);
    } catch (err) {
      console.error("Fetch tweets error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTweets();
  }, [page, sentimentFilter, sortBy, sortOrder]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchTweets();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Search & Explore</h2>
        <p className="text-xs text-slate-400">
          Filter and query ingested tweets by keyword, sentiment polarity, and author
        </p>
      </div>

      {/* Filter and Search Controls */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by keywords, brand (#Apple, OpenAI, bug, battery), or @username..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 font-normal"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-md shadow-indigo-600/30"
          >
            {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
            <span>Search</span>
          </button>
        </form>

        {/* Filter Pills & View controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-800/80 text-xs">
          {/* Sentiment Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-slate-400 font-medium mr-1">Sentiment:</span>
            {[
              { id: "all", label: "All Polarity" },
              { id: "positive", label: "Positive" },
              { id: "negative", label: "Negative" },
              { id: "neutral", label: "Neutral" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setSentimentFilter(tab.id);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  sentimentFilter === tab.id
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sort and View Toggle */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [sb, so] = e.target.value.split("-");
                  setSortBy(sb);
                  setSortOrder(so);
                  setPage(1);
                }}
                className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
              >
                <option value="created_at-desc">Newest First</option>
                <option value="created_at-asc">Oldest First</option>
                <option value="confidence-desc">Highest Confidence</option>
                <option value="confidence-asc">Lowest Confidence</option>
              </select>
            </div>

            <div className="flex items-center rounded-lg bg-slate-900 border border-slate-800 p-0.5">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded ${viewMode === "grid" ? "bg-slate-800 text-indigo-400" : "text-slate-500 hover:text-slate-300"}`}
                title="Grid view"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded ${viewMode === "table" ? "bg-slate-800 text-indigo-400" : "text-slate-500 hover:text-slate-300"}`}
                title="Table view"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <div>
          Showing {data ? data.items.length : 0} of {data ? data.total : 0} tweets
          {query && <span className="text-slate-300 ml-1">matching &ldquo;{query}&rdquo;</span>}
        </div>
        {data && (
          <div>
            Page {data.page} of {data.totalPages}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {data && data.items.length > 0 ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.items.map((tweet) => (
              <TweetCard key={tweet.id} tweet={tweet} />
            ))}
          </div>
        ) : (
          /* Table View */
          <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Author</th>
                    <th className="px-4 py-3">Tweet Content</th>
                    <th className="px-4 py-3">Sentiment</th>
                    <th className="px-4 py-3">Confidence</th>
                    <th className="px-4 py-3">Source</th>
                    <th className="px-4 py-3">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {data.items.map((tweet) => (
                    <tr key={tweet.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="px-4 py-3 font-semibold text-white whitespace-nowrap">
                        @{tweet.author}
                      </td>
                      <td className="px-4 py-3 max-w-md truncate">
                        {tweet.text}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <SentimentBadge sentiment={tweet.sentiment} size="sm" />
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-400 whitespace-nowrap">
                        {((tweet.confidence || 0.85) * 100).toFixed(0)}%
                      </td>
                      <td className="px-4 py-3 capitalize text-slate-400 whitespace-nowrap">
                        {tweet.source.replace("_", " ")}
                      </td>
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                        {timeAgo(tweet.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : (
        <div className="glass-panel rounded-2xl p-12 text-center border border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-slate-500 flex items-center justify-center mx-auto border border-slate-800">
            <Search className="w-6 h-6" />
          </div>
          <h4 className="text-base font-semibold text-slate-200">No tweets found</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search query or sentiment filter to discover more tweets.
          </p>
        </div>
      )}

      {/* Pagination Controls */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={!data.hasPrev || isLoading}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="px-3 py-1 text-xs text-slate-400 font-mono">
            {page} / {data.totalPages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
            disabled={!data.hasNext || isLoading}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
