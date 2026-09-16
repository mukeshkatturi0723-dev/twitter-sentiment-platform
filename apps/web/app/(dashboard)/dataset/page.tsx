"use client";

import React, { useState, useEffect } from "react";
import { api, Tweet, DatasetStats } from "@/lib/api-client";
import { SentimentBadge } from "@/components/ui/Badge";
import {
  Database,
  Search,
  Filter,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  BarChart2
} from "lucide-react";

export default function DatasetPage() {
  const [stats, setStats] = useState<DatasetStats | null>(null);
  const [records, setRecords] = useState<Tweet[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const s = api.getDatasetStats();
    const list = api.getLocalTweets();
    setStats(s);
    setRecords(list);
  }, []);

  const filtered = records.filter((r) => {
    const matchesSearch =
      r.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = classFilter === "all" || r.sentiment === classFilter;
    return matchesSearch && matchesClass;
  });

  const pageSize = 10;
  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Database className="w-6 h-6 text-indigo-400" />
          <span>Dataset Explorer</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Inspect loaded social-media sentiment datasets, class distributions, and data integrity metrics.
        </p>
      </div>

      {/* Privacy Warning */}
      <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3 text-xs text-amber-300">
        <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400" />
        <span>
          <strong>Data Privacy Notice:</strong> Avoid uploading passwords, national identity numbers, financial information, or personal identifiers. Text is processed for sentiment classification only.
        </span>
      </div>

      {/* Dataset Statistics Grid */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-slate-400">Total Rows</span>
            <div className="text-xl font-extrabold text-white font-mono">
              {stats.totalRecords.toLocaleString()}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-slate-400">Columns</span>
            <div className="text-xl font-extrabold text-white font-mono">
              {stats.columns.length}
            </div>
            <span className="text-[10px] text-slate-500 font-mono truncate block">
              {stats.columns.slice(0, 3).join(", ")}...
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-slate-400">Classes</span>
            <div className="text-xl font-extrabold text-white font-mono">3 Classes</div>
            <span className="text-[10px] text-slate-500">Pos / Neg / Neu</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-slate-400">Missing Values</span>
            <div className="text-xl font-extrabold text-emerald-400 font-mono">0</div>
            <span className="text-[10px] text-emerald-400/80">Clean data</span>
          </div>
        </div>
      )}

      {/* Class Distribution Breakdown */}
      {stats && (
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
          <h3 className="text-sm font-semibold text-white">Class Distribution</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
              <span className="text-emerald-400 font-medium">Positive</span>
              <span className="font-mono font-bold text-white">{stats.distribution.positive} records</span>
            </div>
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-between">
              <span className="text-rose-400 font-medium">Negative</span>
              <span className="font-mono font-bold text-white">{stats.distribution.negative} records</span>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
              <span className="text-amber-400 font-medium">Neutral</span>
              <span className="font-mono font-bold text-white">{stats.distribution.neutral} records</span>
            </div>
          </div>
        </div>
      )}

      {/* Dataset Records Table */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search dataset records..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
            />
          </div>

          <div className="flex items-center gap-1">
            {["all", "positive", "negative", "neutral"].map((c) => (
              <button
                key={c}
                onClick={() => {
                  setClassFilter(c);
                  setPage(1);
                }}
                className={`px-2.5 py-1 rounded-lg capitalize font-medium transition-all ${
                  classFilter === c
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="py-2.5 px-3">Author</th>
                <th className="py-2.5 px-3">Text Sample</th>
                <th className="py-2.5 px-3 w-32">Class</th>
                <th className="py-2.5 px-3 w-24 text-right">Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {paginated.length > 0 ? (
                paginated.map((r, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 px-3 text-slate-400 font-mono">@{r.author}</td>
                    <td className="py-3 px-3 text-slate-200 max-w-md truncate font-normal">
                      &ldquo;{r.text}&rdquo;
                    </td>
                    <td className="py-3 px-3">
                      <SentimentBadge sentiment={r.sentiment} size="sm" />
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-300 text-right">
                      {(r.confidence * 100).toFixed(0)}%
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-500">
                    No records found matching your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs text-slate-400">
            <span>Page {page} of {totalPages} ({filtered.length} records)</span>
            <div className="flex items-center gap-1.5">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="p-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
