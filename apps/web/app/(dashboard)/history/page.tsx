"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, AnalysisHistoryItem } from "@/lib/api-client";
import { SentimentBadge } from "@/components/ui/Badge";
import {
  History as HistoryIcon,
  Search,
  Trash2,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Filter
} from "lucide-react";

export default function HistoryPage() {
  const router = useRouter();
  const [historyItems, setHistoryItems] = useState<AnalysisHistoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sentimentFilter, setSentimentFilter] = useState("all");

  const loadHistory = () => {
    const items = api.getHistory();
    setHistoryItems(items);
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleDelete = (id: string) => {
    api.deleteHistory(id);
    loadHistory();
  };

  const handleClearAll = () => {
    if (confirm("Are you sure you want to clear your local analysis history?")) {
      api.clearHistory();
      loadHistory();
    }
  };

  const filtered = historyItems.filter((item) => {
    const matchesSearch = item.text.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSentiment = sentimentFilter === "all" || item.sentiment === sentimentFilter;
    return matchesSearch && matchesSentiment;
  });

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <HistoryIcon className="w-6 h-6 text-indigo-400" />
            <span>Analysis History</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Review past single-text predictions, feature attributions, and confidence breakdowns.
          </p>
        </div>

        {historyItems.length > 0 && (
          <button
            onClick={handleClearAll}
            className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Privacy Notice Banner */}
      <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2.5 text-xs text-slate-400">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>
          <strong>Data Privacy:</strong> Your history is stored securely in your browser&apos;s local storage and is never uploaded without explicit submission.
        </span>
      </div>

      {/* Search & Filter Bar */}
      {historyItems.length > 0 && (
        <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="relative flex-1 w-full max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search history records..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
            />
          </div>

          <div className="flex items-center gap-1 self-start sm:self-auto">
            <span className="text-slate-500 mr-1 font-medium">Filter:</span>
            {["all", "positive", "negative", "neutral"].map((f) => (
              <button
                key={f}
                onClick={() => setSentimentFilter(f)}
                className={`px-2.5 py-1 rounded-lg capitalize font-medium transition-all ${
                  sentimentFilter === f
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* History Items List */}
      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3 hover:border-slate-700 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <SentimentBadge sentiment={item.sentiment} confidence={item.confidence} size="sm" />
                  <span className="text-slate-500 font-mono text-[11px]">
                    {new Date(item.timestamp).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                    title="Delete record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-sm text-slate-200 font-normal leading-relaxed">
                &ldquo;{item.text}&rdquo;
              </p>

              {/* Attributed Features */}
              {item.keyFeatures && item.keyFeatures.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] text-slate-500">Key Features:</span>
                  {item.keyFeatures.map((feat, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800 text-[11px] font-mono"
                    >
                      {feat}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="glass-panel rounded-2xl p-12 border border-slate-800 text-center space-y-4 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto border border-indigo-500/20">
            <HistoryIcon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">No analysis history yet</h3>
            <p className="text-xs text-slate-400 mt-1">
              Start by analyzing your first text or tweet to review sentiment predictions here.
            </p>
          </div>
          <Link
            href="/analyze"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Analyze Your First Text &rarr;</span>
          </Link>
        </div>
      )}
    </div>
  );
}
