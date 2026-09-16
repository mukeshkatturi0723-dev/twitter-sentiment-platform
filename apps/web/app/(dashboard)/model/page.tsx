"use client";

import React, { useState, useEffect } from "react";
import { api, ModelMetadata } from "@/lib/api-client";
import { Cpu, CheckCircle2, Award, Layers, Sparkles, BookOpen } from "lucide-react";
import Link from "next/link";

export default function ModelPage() {
  const [modelInfo, setModelInfo] = useState<ModelMetadata | null>(null);

  useEffect(() => {
    setModelInfo(api.getModelInfo());
  }, []);

  if (!modelInfo) return null;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Cpu className="w-6 h-6 text-indigo-400" />
          <span>Model Information & Architecture</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Technical specifications, feature extraction pipeline, and empirical evaluation metrics for the Sentix AI classification engine.
        </p>
      </div>

      {/* Production Model Overview Card */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
          <div>
            <span className="text-[11px] font-mono text-indigo-400 uppercase tracking-wider">
              Active Production Architecture
            </span>
            <h3 className="text-xl font-extrabold text-white mt-0.5">{modelInfo.name}</h3>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-mono self-start sm:self-auto flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>v{modelInfo.version}</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <span className="text-slate-400 font-medium">Feature Extraction Strategy:</span>
            <p className="text-slate-200 leading-relaxed font-mono text-[11px]">
              {modelInfo.featureExtraction}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <span className="text-slate-400 font-medium">Classification Algorithm:</span>
            <p className="text-slate-200 leading-relaxed font-mono text-[11px]">
              {modelInfo.classificationAlgorithm}
            </p>
          </div>
        </div>

        {/* Evaluation Benchmarks */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Empirical Test Benchmarks</span>
            <span className="text-[11px] text-slate-500 font-mono">
              Dataset: {modelInfo.evaluationMetrics.benchmarkDataset}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-xs">Accuracy</span>
              <div className="text-2xl font-extrabold text-white font-mono">
                {modelInfo.evaluationMetrics.accuracy}%
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-xs">Precision</span>
              <div className="text-2xl font-extrabold text-white font-mono">
                {modelInfo.evaluationMetrics.precision}%
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-xs">Recall</span>
              <div className="text-2xl font-extrabold text-white font-mono">
                {modelInfo.evaluationMetrics.recall}%
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-xs">F1-Score</span>
              <div className="text-2xl font-extrabold text-white font-mono">
                {modelInfo.evaluationMetrics.f1Score}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Model Comparison Table */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Comparative Model Benchmarks</h3>
            <p className="text-xs text-slate-400">
              Performance comparison across candidate NLP architectures evaluated on Twitter data
            </p>
          </div>
          <Link
            href="/how-it-works"
            className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium flex items-center gap-1"
          >
            <span>Learn More &rarr;</span>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="py-2.5 px-3">Candidate Model Architecture</th>
                <th className="py-2.5 px-3 text-center">Accuracy</th>
                <th className="py-2.5 px-3 text-center">Precision</th>
                <th className="py-2.5 px-3 text-center">Recall</th>
                <th className="py-2.5 px-3 text-center">F1</th>
                <th className="py-2.5 px-3 text-right">Deployment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {modelInfo.comparisonModels.map((m, idx) => (
                <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-200">
                    {m.name}
                  </td>
                  <td className="py-3 px-3 text-center font-mono text-slate-300">{m.accuracy}%</td>
                  <td className="py-3 px-3 text-center font-mono text-slate-300">{m.precision}%</td>
                  <td className="py-3 px-3 text-center font-mono text-slate-300">{m.recall}%</td>
                  <td className="py-3 px-3 text-center font-mono text-slate-300">{m.f1}%</td>
                  <td className="py-3 px-3 text-right">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                        m.status.includes("Production")
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-slate-800 text-slate-400 border border-slate-700"
                      }`}
                    >
                      {m.status}
                    </span>
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
