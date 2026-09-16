"use client";

import React, { useState } from "react";
import { api } from "@/lib/api-client";
import { ClientNlpResult } from "@/lib/client-nlp";
import { SentimentBadge } from "@/components/ui/Badge";
import {
  Sparkles,
  RotateCcw,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Layers,
  ChevronDown,
  ChevronUp,
  BookmarkPlus,
  ArrowRight,
  Smile,
  Frown,
  Meh,
  Activity
} from "lucide-react";

const EXAMPLES = [
  {
    label: "Positive",
    text: "The new engineering update reduced our API inference latency by 45%! Outstanding productivity and performance. 🚀✨ #Innovation"
  },
  {
    label: "Negative",
    text: "Customer service made me wait on hold for 2 hours only to hang up the phone. Terrible support and extremely disappointing. 😡👎 #Fail"
  },
  {
    label: "Neutral",
    text: "Quarterly monetary policy committee will livestream economic rate decisions at 2:00 PM EST today. #Economics"
  },
  {
    label: "Complex",
    text: "While the battery life is slightly disappointing, the high refresh display and camera sensors make this a truly fantastic phone! ❤️📱"
  }
];

export default function AnalyzePage() {
  const [inputText, setInputText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ClientNlpResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showRawPipeline, setShowRawPipeline] = useState(false);
  const [historySaved, setHistorySaved] = useState(false);
  const [streamedSuccess, setStreamedSuccess] = useState(false);

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    try {
      setIsAnalyzing(true);
      setErrorMsg(null);
      setHistorySaved(false);
      setStreamedSuccess(false);

      const nlpResult = await api.analyzeText(inputText.trim());
      setResult(nlpResult);

      // Automatically persist to client history
      api.addHistory({
        text: inputText.trim(),
        sentiment: nlpResult.sentiment,
        confidence: nlpResult.confidence,
        scores: nlpResult.scores,
        keyFeatures: [...nlpResult.positiveWords, ...nlpResult.negativeWords, ...nlpResult.emojis].slice(0, 5),
        source: "manual"
      });
      setHistorySaved(true);
    } catch (err: any) {
      setErrorMsg("We couldn't analyze this text right now. Please check the input and try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setInputText("");
    setResult(null);
    setErrorMsg(null);
    setHistorySaved(false);
    setStreamedSuccess(false);
  };

  const handleStreamToDashboard = async () => {
    if (!result || !inputText.trim()) return;
    try {
      await api.ingestTweet({
        text: inputText.trim(),
        author: "analyst_workspace",
        source: "manual"
      });
      setStreamedSuccess(true);
      setTimeout(() => setStreamedSuccess(false), 2500);
    } catch (e) {
      console.warn("Stream error:", e);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-indigo-400" />
          <span>Analyze Text</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Enter a tweet, review, comment, or social-media post to analyze sentiment and feature attribution.
        </p>
      </div>

      {/* Main Analysis Input Area */}
      <form onSubmit={handleAnalyze} className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4 shadow-xl">
        {/* Quick Example Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
          <span className="text-xs font-medium text-slate-400">Try an example:</span>
          <div className="flex flex-wrap items-center gap-1.5">
            {EXAMPLES.map((ex, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setInputText(ex.text);
                  setResult(null);
                }}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
              >
                {ex.label}
              </button>
            ))}
          </div>
        </div>

        {/* Textarea */}
        <div className="relative">
          <textarea
            required
            rows={4}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste a tweet or any social-media text here…"
            className="w-full p-4 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 resize-none font-normal leading-relaxed"
          />
          <div className="absolute right-3 bottom-3 text-[11px] font-mono text-slate-500">
            {inputText.length} characters
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Buttons */}
        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-2 rounded-xl text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>

          <button
            type="submit"
            disabled={!inputText.trim() || isAnalyzing}
            className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <Activity className="w-4 h-4 animate-spin" />
                <span>Analyzing Sentiment…</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analyze Sentiment</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Analysis Result Panel */}
      {result && (
        <div className="space-y-6 animate-fade-in-up">
          {/* Main Prediction Card */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                  Model Prediction
                </span>
                <h3 className="text-2xl font-extrabold text-white flex items-center gap-3 mt-1">
                  <span className="capitalize">{result.sentiment}</span>
                  <SentimentBadge sentiment={result.sentiment} confidence={result.confidence} />
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleStreamToDashboard}
                  disabled={streamedSuccess}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 flex items-center gap-1.5 transition-colors"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{streamedSuccess ? "Streamed to Feed!" : "Broadcast to Live Feed"}</span>
                </button>
              </div>
            </div>

            {/* Probability Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Positive Probability */}
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-emerald-400">
                  <span className="flex items-center gap-1.5">
                    <Smile className="w-4 h-4" />
                    <span>Positive</span>
                  </span>
                  <span className="font-mono">{(result.scores.positive * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${result.scores.positive * 100}%` }}
                    className="h-full bg-emerald-500 transition-all duration-500"
                  />
                </div>
              </div>

              {/* Neutral Probability */}
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-amber-400">
                  <span className="flex items-center gap-1.5">
                    <Meh className="w-4 h-4" />
                    <span>Neutral</span>
                  </span>
                  <span className="font-mono">{(result.scores.neutral * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${result.scores.neutral * 100}%` }}
                    className="h-full bg-amber-500 transition-all duration-500"
                  />
                </div>
              </div>

              {/* Negative Probability */}
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-rose-400">
                  <span className="flex items-center gap-1.5">
                    <Frown className="w-4 h-4" />
                    <span>Negative</span>
                  </span>
                  <span className="font-mono">{(result.scores.negative * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${result.scores.negative * 100}%` }}
                    className="h-full bg-rose-500 transition-all duration-500"
                  />
                </div>
              </div>
            </div>

            {/* Confidence Metric Callout */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">
                Model Confidence Score: <strong className="text-white font-mono">{(result.confidence * 100).toFixed(1)}%</strong>
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                Engine: {result.engine}
              </span>
            </div>
          </div>

          {/* Section 11: Sentiment Explanation ("Why this prediction?") */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">Why this prediction?</h3>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">Feature-Based Interpretation</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {result.summaryExplanation}
            </p>

            {/* Highlighted text features */}
            {result.featureAttributions.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <div className="text-xs font-medium text-slate-400">Important Text Features Identified:</div>
                <div className="flex flex-wrap items-center gap-2">
                  {result.featureAttributions.map((feat, i) => (
                    <span
                      key={i}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-medium border ${
                        feat.type === "positive"
                          ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                          : feat.type === "negative"
                          ? "bg-rose-500/15 text-rose-400 border-rose-500/30"
                          : "bg-indigo-500/15 text-indigo-300 border-indigo-500/30"
                      }`}
                    >
                      <span>{feat.token}</span>
                      <span className="text-[10px] opacity-70">
                        ({feat.weight > 0 ? `+${feat.weight}` : feat.weight})
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="text-[11px] text-slate-500 italic">
              Note: This explanation reflects feature attribution weights and lexicon score density rather than human consciousness.
            </div>
          </div>

          {/* Section 12: NLP Pipeline Visualization */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">NLP Pipeline Workflow</h3>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">6 Stages Executed</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-xs">
              {result.pipeline.map((stage, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5"
                >
                  <div className="flex items-center justify-between font-mono text-[10px] text-indigo-400">
                    <span>{stage.step}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="font-semibold text-slate-200">{stage.title}</div>
                  <div className="text-[11px] text-slate-400 truncate">
                    {Array.isArray(stage.output) ? stage.output.join(", ") : stage.output}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 13: Expandable Raw NLP Processing Panel */}
          <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
            <button
              type="button"
              onClick={() => setShowRawPipeline(!showRawPipeline)}
              className="w-full px-6 py-4 flex items-center justify-between text-xs font-semibold text-slate-300 hover:text-white transition-colors bg-slate-900/40"
            >
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-400" />
                <span>View Raw NLP Processing Data</span>
              </div>
              {showRawPipeline ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showRawPipeline && (
              <div className="p-6 border-t border-slate-800 space-y-4 bg-slate-950/60 font-mono text-xs">
                <div className="space-y-1">
                  <div className="text-slate-400 text-[11px]">1. Original Text:</div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-200">
                    {result.original_text}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-slate-400 text-[11px]">2. Cleaned Normalized Text:</div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-200">
                    {result.cleaned_text}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-slate-400 text-[11px]">3. Extracted Tokens ({result.tokens.length}):</div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 flex flex-wrap gap-1.5">
                    {result.tokens.map((t, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-slate-400 text-[11px]">4. Processed Keywords / Distinct Features:</div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 flex flex-wrap gap-1.5">
                    {result.keywords.map((kw, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 text-[11px] border border-indigo-500/20">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
