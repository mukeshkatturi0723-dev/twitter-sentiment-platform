import React, { useState } from "react";
import { api, ClassifyResult } from "@/lib/api-client";
import { SentimentBadge } from "@/components/ui/Badge";
import { Sparkles, Send, CheckCircle2, CornerDownLeft } from "lucide-react";

interface AdHocClassifierProps {
  onIngestSuccess?: () => void;
}

export const AdHocClassifier: React.FC<AdHocClassifierProps> = ({ onIngestSuccess }) => {
  const [text, setText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ClassifyResult | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedSuccess, setPublishedSuccess] = useState(false);

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!text.trim()) return;

    try {
      setIsAnalyzing(true);
      const res = await api.classifyText(text);
      setResult(res);
      setPublishedSuccess(false);
    } catch (err) {
      console.error("Classification error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePublish = async () => {
    if (!text.trim()) return;
    try {
      setIsPublishing(true);
      await api.ingestTweet({
        text,
        author: "web_analyst",
        source: "manual"
      });
      setPublishedSuccess(true);
      if (onIngestSuccess) onIngestSuccess();
      setTimeout(() => {
        setText("");
        setResult(null);
        setPublishedSuccess(false);
      }, 1500);
    } catch (err) {
      console.error("Publish failed:", err);
    } finally {
      setIsPublishing(false);
    }
  };

  const sampleTweets = [
    "The new AI reasoning benchmarks are unbelievable! 10x faster productivity. 🚀✨ #AI #Innovation",
    "Customer service made me wait 2 hours only to hang up the phone. Horrible experience! 😡👎 #Fail",
    "Quarterly monetary policy review will be livestreamed on the central bank portal tomorrow."
  ];

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Live NLP Tweet Classifier</h3>
            <p className="text-xs text-slate-400">Test any tweet or phrase through the sentiment pipeline</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-slate-500">Quick test:</span>
          {sampleTweets.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setText(s);
                setResult(null);
              }}
              className="text-[10px] px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            >
              Ex {i + 1}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleAnalyze} className="space-y-3">
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste any tweet text here to classify sentiment..."
            rows={3}
            className="w-full bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 resize-none font-normal"
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">
            {text.length} characters
          </span>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={isAnalyzing || !text.trim()}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-md shadow-indigo-600/30 active:scale-95 cursor-pointer"
            >
              {isAnalyzing ? (
                <>Scoring...</>
              ) : (
                <>
                  <span>Classify Sentiment</span>
                  <CornerDownLeft className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Result Display */}
      {result && (
        <div className="mt-4 p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 font-medium">Result:</span>
              <SentimentBadge sentiment={result.sentiment} confidence={result.confidence} />
              <span className="text-xs text-slate-400">
                Engine: <span className="font-mono text-slate-300">{result.engine}</span>
              </span>
            </div>

            <button
              onClick={handlePublish}
              disabled={isPublishing || publishedSuccess}
              className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                publishedSuccess
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
              }`}
            >
              {publishedSuccess ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Pushed to Live Stream!</span>
                </>
              ) : (
                <>
                  <Send className="w-3 h-3 text-slate-400" />
                  <span>Push to Feed</span>
                </>
              )}
            </button>
          </div>

          {/* Probability Breakdown Bar */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="text-emerald-400 font-medium">
                Pos: {(result.scores.positive * 100).toFixed(1)}%
              </span>
              <span className="text-slate-400 font-medium">
                Neu: {(result.scores.neutral * 100).toFixed(1)}%
              </span>
              <span className="text-rose-400 font-medium">
                Neg: {(result.scores.negative * 100).toFixed(1)}%
              </span>
            </div>

            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
              <div
                className="bg-emerald-500 h-full transition-all duration-500"
                style={{ width: `${result.scores.positive * 100}%` }}
                title={`Positive: ${(result.scores.positive * 100).toFixed(1)}%`}
              />
              <div
                className="bg-slate-500 h-full transition-all duration-500"
                style={{ width: `${result.scores.neutral * 100}%` }}
                title={`Neutral: ${(result.scores.neutral * 100).toFixed(1)}%`}
              />
              <div
                className="bg-rose-500 h-full transition-all duration-500"
                style={{ width: `${result.scores.negative * 100}%` }}
                title={`Negative: ${(result.scores.negative * 100).toFixed(1)}%`}
              />
            </div>
          </div>

          {/* Extracted keywords */}
          {result.keywords && result.keywords.length > 0 && (
            <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2 text-xs">
              <span className="text-slate-500 text-[11px]">Keywords:</span>
              <div className="flex flex-wrap gap-1">
                {result.keywords.map((kw, i) => (
                  <span key={i} className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
