"use client";

import React, { useState, useRef } from "react";
import { api, Tweet } from "@/lib/api-client";
import { SentimentBadge } from "@/components/ui/Badge";
import { SentimentDonutChart } from "@/components/charts/SentimentDonutChart";
import {
  UploadCloud,
  FileSpreadsheet,
  Download,
  Search,
  Filter,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  FileText,
  ChevronLeft,
  ChevronRight,
  BarChart3
} from "lucide-react";

export default function BatchAnalysisPage() {
  const [file, setFile] = useState<File | null>(null);
  const [textColumn, setTextColumn] = useState("text");
  const [isProcessing, setIsProcessing] = useState(false);
  const [batchResult, setBatchResult] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sentimentFilter, setSentimentFilter] = useState("all");
  const [page, setPage] = useState(1);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setErrorMsg(null);
    }
  };

  const handleProcessBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    try {
      setIsProcessing(true);
      setErrorMsg(null);
      const res = await api.uploadCsv(file, textColumn);
      setBatchResult(res);
      setPage(1);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to process dataset. Ensure the CSV contains text rows.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadSample = () => {
    const sample = `author,text,category\nuser_1,"The software updates delivered massive performance improvements! Extremely happy. 🚀",tech\nuser_2,"Battery life degraded significantly after the latest firmware patch. Very disappointing. 😡👎",hardware\nuser_3,"Quarterly financial report released today with flat revenue growth.",finance\nuser_4,"Incredible customer support resolved our issue within 10 minutes! Fantastic work. ❤️✨",service`;
    const blob = new Blob([sample], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "sample_sentiment_batch.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportProcessedCsv = () => {
    if (!batchResult?.sample_results?.length) return;
    const headers = "author,text,sentiment,confidence,ingested_at\n";
    const rows = batchResult.sample_results
      .map(
        (r: Tweet) =>
          `"${r.author}","${r.text.replace(/"/g, '""')}","${r.sentiment}",${r.confidence},"${r.ingested_at}"`
      )
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `sentix_batch_results_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered rows for table
  const allRows: Tweet[] = batchResult?.sample_results || [];
  const filteredRows = allRows.filter((r) => {
    const matchesSearch =
      r.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSentiment = sentimentFilter === "all" || r.sentiment === sentimentFilter;
    return matchesSearch && matchesSentiment;
  });

  const pageSize = 8;
  const totalPages = Math.ceil(filteredRows.length / pageSize) || 1;
  const paginatedRows = filteredRows.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-indigo-400" />
            <span>Batch Sentiment Analysis</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Upload CSV or TXT datasets for high-speed batch classification, distribution metrics, and report export.
          </p>
        </div>

        <button
          onClick={handleDownloadSample}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-slate-400" />
          <span>Download Sample CSV</span>
        </button>
      </div>

      {/* Upload & Column Mapping Box */}
      <form onSubmit={handleProcessBatch} className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-6 text-center">
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.txt"
          onChange={handleFileChange}
          className="hidden"
        />

        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-2xl p-8 sm:p-10 cursor-pointer transition-all bg-slate-900/30 hover:bg-slate-900/60 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto mb-3 border border-indigo-500/20 group-hover:scale-110 transition-transform">
            <UploadCloud className="w-6 h-6" />
          </div>

          <h4 className="text-sm font-semibold text-white mb-1">
            {file ? file.name : "Click to select or drag & drop CSV / TXT file"}
          </h4>
          <p className="text-xs text-slate-500">
            {file ? `${(file.size / 1024).toFixed(1)} KB` : "Supports Sentiment140, customer reviews, or tweet CSVs"}
          </p>
        </div>

        {/* Text Column Selector */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-xs max-w-md mx-auto">
          <label className="text-slate-400 font-medium shrink-0">Text Column Name:</label>
          <input
            type="text"
            value={textColumn}
            onChange={(e) => setTextColumn(e.target.value)}
            placeholder="text, tweet, review, content"
            className="w-full sm:w-48 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 font-mono text-center"
          />
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2 text-left">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="flex items-center justify-center pt-2">
          <button
            type="submit"
            disabled={!file || isProcessing}
            className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-indigo-600/30 active:scale-95 cursor-pointer"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Processing Batch Records…</span>
              </>
            ) : (
              <>
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Run Batch Classification</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Batch Summary & Distribution */}
      {batchResult && (
        <div className="space-y-6 animate-fade-in-up">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Batch Analysis Results</span>
              </h3>
              <p className="text-xs text-slate-400">
                Processed {batchResult.total_rows_processed} rows from &ldquo;{batchResult.filename}&rdquo;
              </p>
            </div>

            <button
              onClick={handleExportProcessedCsv}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 flex items-center gap-1.5 transition-all active:scale-95 self-start sm:self-auto"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV Results</span>
            </button>
          </div>

          {/* Metrics Overview Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-slate-400">Total Processed</span>
              <div className="text-xl font-extrabold text-white font-mono">
                {batchResult.total_rows_processed}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
              <span className="text-emerald-400 font-medium">Positive Mentions</span>
              <div className="text-xl font-extrabold text-emerald-400 font-mono">
                {batchResult.sentiment_distribution.positive.percentage}%
              </div>
              <span className="text-[10px] text-slate-400">({batchResult.sentiment_distribution.positive.count} rows)</span>
            </div>
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-1">
              <span className="text-rose-400 font-medium">Negative Mentions</span>
              <div className="text-xl font-extrabold text-rose-400 font-mono">
                {batchResult.sentiment_distribution.negative.percentage}%
              </div>
              <span className="text-[10px] text-slate-400">({batchResult.sentiment_distribution.negative.count} rows)</span>
            </div>
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1">
              <span className="text-amber-400 font-medium">Neutral / Objective</span>
              <div className="text-xl font-extrabold text-amber-400 font-mono">
                {batchResult.sentiment_distribution.neutral.percentage}%
              </div>
              <span className="text-[10px] text-slate-400">({batchResult.sentiment_distribution.neutral.count} rows)</span>
            </div>
          </div>

          {/* Donut Chart Visualization */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row items-center justify-around gap-6">
            <div className="w-full max-w-xs">
              <SentimentDonutChart
                positive={batchResult.sentiment_distribution.positive.count}
                negative={batchResult.sentiment_distribution.negative.count}
                neutral={batchResult.sentiment_distribution.neutral.count}
              />
            </div>

            <div className="space-y-3 max-w-sm text-xs">
              <h4 className="font-semibold text-white text-sm">Batch Sentiment Polarity</h4>
              <p className="text-slate-400 leading-relaxed">
                Net Sentiment Score (NSS = % Pos - % Neg): <strong className={batchResult.net_sentiment_score >= 0 ? "text-emerald-400" : "text-rose-400"}>{batchResult.net_sentiment_score > 0 ? `+${batchResult.net_sentiment_score}` : batchResult.net_sentiment_score}</strong>.
              </p>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                Average Model Confidence: <strong className="font-mono text-white">{(batchResult.average_confidence * 100).toFixed(1)}%</strong>
              </div>
            </div>
          </div>

          {/* Interactive Results Table */}
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
                  placeholder="Search classified texts..."
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                />
              </div>

              {/* Sentiment Filter Pills */}
              <div className="flex items-center gap-1">
                {["all", "positive", "negative", "neutral"].map((f) => (
                  <button
                    key={f}
                    onClick={() => {
                      setSentimentFilter(f);
                      setPage(1);
                    }}
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

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                    <th className="py-2.5 px-3">Text Content</th>
                    <th className="py-2.5 px-3 w-32">Sentiment</th>
                    <th className="py-2.5 px-3 w-24 text-right">Confidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {paginatedRows.length > 0 ? (
                    paginatedRows.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-900/40 transition-colors">
                        <td className="py-3 px-3 text-slate-200 max-w-md truncate font-normal">
                          &ldquo;{row.text}&rdquo;
                        </td>
                        <td className="py-3 px-3">
                          <SentimentBadge sentiment={row.sentiment} size="sm" />
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-300 text-right">
                          {(row.confidence * 100).toFixed(1)}%
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="py-8 text-center text-slate-500">
                        No rows match your filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs text-slate-400">
                <span>Page {page} of {totalPages} ({filteredRows.length} total)</span>
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
      )}
    </div>
  );
}
