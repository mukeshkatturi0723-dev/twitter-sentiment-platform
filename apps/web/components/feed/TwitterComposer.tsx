"use client";

import React, { useState } from "react";
import { api, Tweet, ClassifyResult } from "@/lib/api-client";
import { SentimentBadge } from "@/components/ui/Badge";
import { Sparkles, Send, Smile, Hash, CornerDownLeft } from "lucide-react";

interface TwitterComposerProps {
  onTweetPosted?: (tweet: Tweet) => void;
}

const PRESETS = [
  "The new AI reasoning update is unbelievable! 10x faster productivity. 🚀✨ #AI #Tech",
  "Flight delayed 4 hours with zero communication. Horrible experience! 😡👎 #TravelFail",
  "Quarterly earnings report will be livestreamed on the investor portal tomorrow at 10 AM.",
];

export const TwitterComposer: React.FC<TwitterComposerProps> = ({ onTweetPosted }) => {
  const [text, setText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [liveSentiment, setLiveSentiment] = useState<ClassifyResult | null>(null);
  const [authorHandle, setAuthorHandle] = useState("analyst");

  // Load user handle if set
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("pulseai_twitter_handle");
      if (stored) setAuthorHandle(stored);
    }
  }, []);

  // Quick classify as user types (debounced)
  React.useEffect(() => {
    if (!text.trim() || text.length < 5) {
      setLiveSentiment(null);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await api.classifyText(text);
        setLiveSentiment(res);
      } catch (e) {
        // ignore background classify error
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [text]);

  const handlePost = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!text.trim() || isAnalyzing) return;

    try {
      setIsAnalyzing(true);
      const res = await api.ingestTweet({
        text: text.trim(),
        author: authorHandle,
        source: "twitter_web"
      });

      if (res && res.tweet) {
        if (onTweetPosted) onTweetPosted(res.tweet);
      }

      setText("");
      setLiveSentiment(null);
    } catch (err) {
      console.error("Failed to post tweet:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const initial = authorHandle ? authorHandle.charAt(0).toUpperCase() : "A";

  return (
    <div className="border-b border-[#2f3336] p-4 transition-colors bg-[#000000]/40">
      <div className="flex gap-3">
        {/* User Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#1d9bf0] to-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow">
          {initial}
        </div>

        {/* Composer Form */}
        <div className="flex-1 min-w-0">
          <form onSubmit={handlePost}>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What is happening?! Type or paste a tweet to analyze sentiment..."
              rows={2}
              className="w-full bg-transparent text-white placeholder-neutral-500 text-[15px] leading-relaxed resize-none focus:outline-none border-none p-0 focus:ring-0 font-normal"
            />

            {/* Real-time sentiment prediction bar if typing */}
            {liveSentiment && (
              <div className="my-2.5 p-2.5 rounded-xl bg-[#16181c] border border-[#2f3336] flex items-center justify-between text-xs animate-fade-in">
                <div className="flex items-center gap-2">
                  <span className="text-neutral-400 text-[11px] font-medium">Predicted Sentiment:</span>
                  <SentimentBadge sentiment={liveSentiment.sentiment} confidence={liveSentiment.confidence} />
                </div>
                <div className="flex items-center gap-2 text-[11px] text-neutral-400">
                  <span>Confidence: {(liveSentiment.confidence * 100).toFixed(0)}%</span>
                  <div className="w-14 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        liveSentiment.sentiment === "positive"
                          ? "bg-[#00ba7c]"
                          : liveSentiment.sentiment === "negative"
                          ? "bg-[#f91880]"
                          : "bg-[#71767b]"
                      }`}
                      style={{ width: `${liveSentiment.confidence * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Quick Presets */}
            {text.length === 0 && (
              <div className="mt-1 mb-2.5 flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-neutral-500">Presets:</span>
                {PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setText(preset)}
                    className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#16181c] hover:bg-[#202327] text-neutral-300 hover:text-white border border-[#2f3336] transition-colors"
                  >
                    {idx === 0 ? "🚀 Tech Review" : idx === 1 ? "😡 Complaint" : "📢 News"}
                  </button>
                ))}
              </div>
            )}

            {/* Footer: Tools + Post Button */}
            <div className="pt-2.5 border-t border-[#2f3336]/60 flex items-center justify-between">
              <div className="flex items-center gap-1 text-[#1d9bf0]">
                <button
                  type="button"
                  title="Add hashtag"
                  onClick={() => setText((prev) => prev + " #Sentiment")}
                  className="p-1.5 rounded-full hover:bg-[#1d9bf0]/10 transition-colors cursor-pointer"
                >
                  <Hash className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  title="Add positive emoji"
                  onClick={() => setText((prev) => prev + " 😊")}
                  className="p-1.5 rounded-full hover:bg-[#1d9bf0]/10 transition-colors cursor-pointer"
                >
                  <Smile className="w-4 h-4" />
                </button>
                <span className="text-[11px] text-neutral-500 ml-1">
                  NLP Sentiment Auto-Classify
                </span>
              </div>

              <div className="flex items-center gap-3">
                {text.length > 0 && (
                  <span className="text-xs text-neutral-500 font-mono">
                    {280 - text.length}
                  </span>
                )}
                <button
                  type="submit"
                  disabled={!text.trim() || isAnalyzing}
                  className="px-4 py-1.5 rounded-full bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-bold text-xs tracking-wide shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 active:scale-95 cursor-pointer"
                >
                  {isAnalyzing ? (
                    <span>Scoring...</span>
                  ) : (
                    <>
                      <span>Analyze & Post</span>
                      <CornerDownLeft className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
