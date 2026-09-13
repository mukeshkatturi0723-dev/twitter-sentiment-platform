"use client";

import React, { useState, useEffect } from "react";
import { api, BrandComparisonItem } from "@/lib/api-client";
import { ComparisonBarChart } from "@/components/charts/ComparisonBarChart";
import {
  BarChart3,
  Download,
  Plus,
  X,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Award
} from "lucide-react";

const DEFAULT_BRANDS = ["Apple", "Google", "Microsoft", "OpenAI", "Tesla", "Nvidia"];

export default function AnalyticsPage() {
  const [brands, setBrands] = useState<string[]>(DEFAULT_BRANDS);
  const [newBrandInput, setNewBrandInput] = useState("");
  const [comparisonData, setComparisonData] = useState<BrandComparisonItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchComparison = async () => {
    if (brands.length === 0) return;
    try {
      setIsLoading(true);
      const res = await api.getBrandComparison(brands.join(","));
      setComparisonData(res.brands);
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
    link.setAttribute("download", `sentiment-brand-report-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Find highest Net Sentiment Score leader
  const leader = [...comparisonData].sort((a, b) => b.net_sentiment_score - a.net_sentiment_score)[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Comparative Brand Analytics</h2>
          <p className="text-xs text-slate-400">
            Benchmark perception, net sentiment score (NSS), and share of voice across entities
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchComparison}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Recalculate</span>
          </button>

          <button
            onClick={handleExportCsv}
            disabled={comparisonData.length === 0}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/30 active:scale-95 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV Report</span>
          </button>
        </div>
      </div>

      {/* Brand Filter Chips & Input */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Active Comparison Entities:</span>
          <span className="text-[11px] text-slate-500">{brands.length} selected</span>
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
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Sentiment Ratio Distribution by Brand</h3>
            <p className="text-xs text-slate-400">% Positive vs % Neutral vs % Negative mentions</p>
          </div>

          {leader && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs">
              <Award className="w-3.5 h-3.5" />
              <span>Highest NSS: <strong>{leader.brand}</strong> (+{leader.net_sentiment_score}%)</span>
            </div>
          )}
        </div>

        <ComparisonBarChart data={comparisonData} />
      </div>

      {/* Ranking & Metrics Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Brand Perception Matrix</h3>
            <p className="text-xs text-slate-400">Net Sentiment Score = (% Positive) - (% Negative)</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-5 py-3">Brand / Keyword</th>
                <th className="px-5 py-3">Sample Mentions</th>
                <th className="px-5 py-3 text-emerald-400">Positive %</th>
                <th className="px-5 py-3 text-slate-400">Neutral %</th>
                <th className="px-5 py-3 text-rose-400">Negative %</th>
                <th className="px-5 py-3">Net Sentiment Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {comparisonData.map((b) => (
                <tr key={b.brand} className="hover:bg-slate-900/40 transition-colors">
                  <td className="px-5 py-3 font-semibold text-white whitespace-nowrap">
                    {b.brand}
                  </td>
                  <td className="px-5 py-3 font-mono text-slate-400">
                    {b.total_mentions}
                  </td>
                  <td className="px-5 py-3 font-mono text-emerald-400 font-medium">
                    {b.positive_percentage.toFixed(1)}%
                  </td>
                  <td className="px-5 py-3 font-mono text-slate-400">
                    {b.neutral_percentage.toFixed(1)}%
                  </td>
                  <td className="px-5 py-3 font-mono text-rose-400 font-medium">
                    {b.negative_percentage.toFixed(1)}%
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1.5 font-mono font-bold">
                      {b.net_sentiment_score > 0 ? (
                        <span className="text-emerald-400 flex items-center">
                          <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                          +{b.net_sentiment_score}%
                        </span>
                      ) : b.net_sentiment_score < 0 ? (
                        <span className="text-rose-400 flex items-center">
                          <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
                          {b.net_sentiment_score}%
                        </span>
                      ) : (
                        <span className="text-slate-400">0.0%</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
