"use client";

import React, { useState, useEffect } from "react";
import { api, BrandComparisonItem, AnalyticsSummary } from "@/lib/api-client";
import { ComparisonBarChart } from "@/components/charts/ComparisonBarChart";
import {
  BarChart3,
  Download,
  Plus,
  X,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Award,
  FileText,
  CheckCircle2,
  Printer
} from "lucide-react";

const DEFAULT_BRANDS = ["Apple", "Google", "Microsoft", "OpenAI", "Tesla", "Nvidia"];

export default function AnalyticsPage() {
  const [brands, setBrands] = useState<string[]>(DEFAULT_BRANDS);
  const [newBrandInput, setNewBrandInput] = useState("");
  const [comparisonData, setComparisonData] = useState<BrandComparisonItem[]>([]);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const fetchComparison = async () => {
    if (brands.length === 0) return;
    try {
      setIsLoading(true);
      const [cmpRes, sumRes] = await Promise.all([
        api.getBrandComparison(brands.join(",")),
        api.getSummary()
      ]);
      setComparisonData(cmpRes.brands);
      setSummary(sumRes);
    } catch (err) {
      console.error("Comparison fetch failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComparison();
  }, [brands]);

  const handleAddBrand = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newBrandInput.trim();
    if (clean && !brands.includes(clean)) {
      setBrands([...brands, clean]);
      setNewBrandInput("");
    }
  };

  const handleRemoveBrand = (brandToRemove: string) => {
    setBrands(brands.filter((b) => b !== brandToRemove));
  };

  const handleExportCsv = () => {
    if (!comparisonData.length) return;
    const headers = "Brand,Mentions,Positive_Pct,Neutral_Pct,Negative_Pct,Net_Sentiment_Score\n";
    const rows = comparisonData
      .map(
        (b) =>
          `"${b.brand}",${b.total_mentions},${b.positive_percentage},${b.neutral_percentage},${b.negative_percentage},${b.net_sentiment_score}`
      )
      .join("\n");
    
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `sentix-brand-intelligence-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const leader = [...comparisonData].sort((a, b) => b.net_sentiment_score - a.net_sentiment_score)[0];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-400" />
            <span>Comparative Brand Analytics</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Benchmark Net Sentiment Score (NSS = % Pos - % Neg), volume shares, and sentiment distribution across entities.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={fetchComparison}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Recalculate</span>
          </button>

          <button
            onClick={() => setShowReportModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-all cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
            <span>Export Report</span>
          </button>

          <button
            onClick={handleExportCsv}
            disabled={comparisonData.length === 0}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/30 active:scale-95 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV</span>
          </button>
        </div>
      </div>

      {/* Dataset Summary Cards */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-slate-400">Total Records</span>
            <div className="text-xl font-extrabold text-white font-mono">{summary.total_tweets}</div>
          </div>
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
            <span className="text-emerald-400 font-medium">Positive Ratio</span>
            <div className="text-xl font-extrabold text-emerald-400 font-mono">{summary.percentages.positive}%</div>
          </div>
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-1">
            <span className="text-rose-400 font-medium">Negative Ratio</span>
            <div className="text-xl font-extrabold text-rose-400 font-mono">{summary.percentages.negative}%</div>
          </div>
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1">
            <span className="text-amber-400 font-medium">Neutral Ratio</span>
            <div className="text-xl font-extrabold text-amber-400 font-mono">{summary.percentages.neutral}%</div>
          </div>
        </div>
      )}

      {/* Brand Filter Chips & Input */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Active Comparison Entities:</span>
          <span className="text-[11px] text-slate-500">{brands.length} active</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {brands.map((brand) => (
            <span
              key={brand}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 text-slate-200 border border-slate-800 text-xs font-medium"
            >
              <span>{brand}</span>
              <button
                onClick={() => handleRemoveBrand(brand)}
                className="text-slate-400 hover:text-rose-400 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          <form onSubmit={handleAddBrand} className="inline-flex items-center">
            <input
              type="text"
              value={newBrandInput}
              onChange={(e) => setNewBrandInput(e.target.value)}
              placeholder="+ Add brand/term..."
              className="px-3 py-1 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 w-36"
            />
          </form>
        </div>
      </div>

      {/* Comparative Bar Chart */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Sentiment Ratio Distribution by Brand</h3>
            <p className="text-xs text-slate-400">% Positive vs % Neutral vs % Negative mentions</p>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-mono">
            Stacked Ratio
          </span>
        </div>

        <ComparisonBarChart data={comparisonData} />
      </div>

      {/* Entity NSS Table */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4 shadow-xl">
        <h3 className="text-sm font-semibold text-white">Entity Scorecard Breakdown</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="py-2.5 px-3">Entity Name</th>
                <th className="py-2.5 px-3 text-center">Mentions</th>
                <th className="py-2.5 px-3 text-center text-emerald-400">Positive %</th>
                <th className="py-2.5 px-3 text-center text-amber-400">Neutral %</th>
                <th className="py-2.5 px-3 text-center text-rose-400">Negative %</th>
                <th className="py-2.5 px-3 text-right">Net Sentiment Score (NSS)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {comparisonData.map((b, idx) => (
                <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-3 font-semibold text-white">{b.brand}</td>
                  <td className="py-3 px-3 text-center font-mono text-slate-300">{b.total_mentions}</td>
                  <td className="py-3 px-3 text-center font-mono text-emerald-400">{b.positive_percentage}%</td>
                  <td className="py-3 px-3 text-center font-mono text-amber-400">{b.neutral_percentage}%</td>
                  <td className="py-3 px-3 text-center font-mono text-rose-400">{b.negative_percentage}%</td>
                  <td className="py-3 px-3 text-right font-mono font-bold">
                    <span className={b.net_sentiment_score >= 0 ? "text-emerald-400" : "text-rose-400"}>
                      {b.net_sentiment_score > 0 ? `+${b.net_sentiment_score}` : b.net_sentiment_score}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl glass-panel bg-slate-950 rounded-3xl border border-slate-800 p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto text-left">
            <button
              onClick={() => setShowReportModal(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400">
                Official Analytical Report
              </span>
              <h3 className="text-lg font-bold text-white">Sentix AI — Social Sentiment Intelligence Report</h3>
              <p className="text-xs text-slate-400">Generated on {new Date().toLocaleDateString("en-US", { dateStyle: "full" })}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
              <div className="font-semibold text-white">Executive Dataset Summary:</div>
              <p className="text-slate-300">
                Total Analyzed Mentions: <strong>{summary?.total_tweets || comparisonData.reduce((acc, c) => acc + c.total_mentions, 0)}</strong>
              </p>
              <p className="text-slate-300">
                Model Engine: <strong>Sentix RoBERTa + Lexicon Hybrid Ensemble (cardiffnlp/twitter-roberta-base)</strong>
              </p>
              <p className="text-slate-300">
                Leading Entity by NSS: <strong className="text-emerald-400">{leader?.brand || "N/A"}</strong> ({leader?.net_sentiment_score > 0 ? `+${leader?.net_sentiment_score}` : leader?.net_sentiment_score})
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-white">Brand Comparison Breakdown:</div>
              <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl overflow-hidden text-xs">
                {comparisonData.map((b, i) => (
                  <div key={i} className="p-3 flex items-center justify-between bg-slate-900/50">
                    <span className="font-medium text-slate-200">{b.brand}</span>
                    <span className="font-mono text-slate-300">
                      Pos: {b.positive_percentage}% | Neg: {b.negative_percentage}% | NSS: <strong className={b.net_sentiment_score >= 0 ? "text-emerald-400" : "text-rose-400"}>{b.net_sentiment_score}</strong>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
              <span className="text-slate-500 font-mono">Confidential Social Intelligence</span>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-1.5 transition-all shadow-md"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save as PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
