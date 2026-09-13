"use client";

import React, { useState, useRef } from "react";
import { api } from "@/lib/api-client";
import { SentimentBadge } from "@/components/ui/Badge";
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Download,
  RefreshCw,
  FileText
} from "lucide-react";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setErrorMsg(null);
      setUploadResult(null);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    try {
      setIsUploading(true);
      setErrorMsg(null);
      const res = await api.uploadCsv(file);
      setUploadResult(res);
    } catch (err: any) {
      console.error("Upload error:", err);
      setErrorMsg(err.message || "Failed to upload and classify CSV.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadTemplate = () => {
    const sampleCsv = `author,text,created_at\nelonfan,"The new space launch and orbital telemetry went flawlessly! Super excited 🚀",2026-09-12T10:00:00Z\nfrustrated_dev,"The latest database release has a memory leak bug that crashed our cluster 😡",2026-09-12T11:00:00Z\ntech_wire,"Semiconductor manufacturers report flat quarter-over-quarter wafer shipments.",2026-09-12T12:00:00Z\ngadget_lover,"The high refresh display and camera sensors make this the best phone ever! ❤️✨",2026-09-12T13:00:00Z`;

    const blob = new Blob([sampleCsv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "tweets_sample_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Batch CSV Sentiment Analysis</h2>
          <p className="text-xs text-slate-400">
            Upload large datasets of tweets or customer feedback for high-speed batch NLP classification
          </p>
        </div>

        <button
          onClick={handleDownloadTemplate}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-slate-400" />
          <span>Download Sample CSV</span>
        </button>
      </div>

      {/* Upload Box */}
      <form onSubmit={handleUploadSubmit} className="glass-panel rounded-2xl p-8 border border-slate-800 space-y-5 text-center">
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.txt"
          onChange={handleFileChange}
          className="hidden"
        />

        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-2xl p-10 cursor-pointer transition-all bg-slate-900/30 hover:bg-slate-900/60 group"
        >
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto mb-4 border border-indigo-500/20 group-hover:scale-110 transition-transform">
            <UploadCloud className="w-7 h-7" />
          </div>

          <h4 className="text-sm font-semibold text-white mb-1">
            {file ? file.name : "Click to upload or drag & drop CSV file"}
          </h4>
          <p className="text-xs text-slate-500">
            {file ? `${(file.size / 1024).toFixed(1)} KB` : "Supports Sentiment140 or standard columns: text, author, created_at"}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2 text-left">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="flex items-center justify-center gap-3">
          <button
            type="submit"
            disabled={!file || isUploading}
            className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-indigo-600/30 active:scale-95 cursor-pointer"
          >
            {isUploading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Classifying Batch Tweets...</span>
              </>
            ) : (
              <>
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Start Batch Analysis</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Upload Results Summary */}
      {uploadResult && (
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-6 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-semibold text-white">Batch Classification Complete</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              {uploadResult.total_processed} tweets scored
            </span>
          </div>

          {/* Breakdown Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">Positive</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white">{uploadResult.breakdown.positive}</span>
                <span className="text-xs text-emerald-400">({uploadResult.positive_percentage}%)</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
              <span className="text-xs font-medium text-rose-400 uppercase tracking-wider">Negative</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white">{uploadResult.breakdown.negative}</span>
                <span className="text-xs text-rose-400">({uploadResult.negative_percentage}%)</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-500/10 border border-slate-500/20">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Neutral</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white">{uploadResult.breakdown.neutral}</span>
                <span className="text-xs text-slate-400">({uploadResult.neutral_percentage}%)</span>
              </div>
            </div>
          </div>

          {/* Preview Table */}
          {uploadResult.preview && uploadResult.preview.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Sample Classified Records:
              </h4>

              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="px-4 py-2.5">Author</th>
                      <th className="px-4 py-2.5">Tweet Text</th>
                      <th className="px-4 py-2.5">Sentiment</th>
                      <th className="px-4 py-2.5">Confidence</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {uploadResult.preview.map((row: any, i: number) => (
                      <tr key={i} className="hover:bg-slate-900/40">
                        <td className="px-4 py-2.5 font-medium text-white whitespace-nowrap">
                          @{row.author}
                        </td>
                        <td className="px-4 py-2.5 max-w-lg truncate">
                          {row.text}
                        </td>
                        <td className="px-4 py-2.5 whitespace-nowrap">
                          <SentimentBadge sentiment={row.sentiment} size="sm" />
                        </td>
                        <td className="px-4 py-2.5 font-mono text-slate-400 whitespace-nowrap">
                          {((row.confidence || 0.85) * 100).toFixed(0)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
