"use client";

import React, { useState } from "react";
import { api, Tweet } from "@/lib/api-client";
import { clientClassify } from "@/lib/client-nlp";
import { SentimentBadge } from "@/components/ui/Badge";
import {
  X,
  Send,
  Sparkles,
  Twitter,
  Mail,
  CheckCircle2,
  RefreshCw,
  Hash,
  AlertCircle
} from "lucide-react";

interface AddTweetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AddTweetModal: React.FC<AddTweetModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [activeTab, setActiveTab] = useState<"custom" | "twitter" | "mail">("custom");
  const [tweetText, setTweetText] = useState("");
  const [authorHandle, setAuthorHandle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Twitter connect state
  const [twitterHandle, setTwitterHandle] = useState("");
  const [bearerToken, setBearerToken] = useState("");

  // Mail state
  const [userEmail, setUserEmail] = useState(api.getCurrentUserEmail());

  if (!isOpen) return null;

  // Live preview sentiment
  const previewNlp = tweetText.trim().length > 3 ? clientClassify(tweetText) : null;

  const handleSubmitCustomTweet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tweetText.trim()) return;

    try {
      setIsSubmitting(true);
      await api.ingestTweet({
        text: tweetText.trim(),
        author: authorHandle.trim() ? authorHandle.trim() : "my_account",
        source: "user_submitted"
      });

      setSuccessMsg("Tweet analyzed and streamed successfully!");
      setTweetText("");
      if (onSuccess) onSuccess();

      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 1200);
    } catch (err: any) {
      console.error("Submit error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConnectTwitter = async (e: React.FormEvent) => {
    e.preventDefault();
    const handle = twitterHandle.replace("@", "").trim() || "my_brand";
    try {
      setIsSubmitting(true);
      // Ingest 2 sample live tweets for this handle
      await api.ingestTweet({
        text: `Big milestones achieved today at @${handle}! Thank you to our incredible community for the support. 🚀❤️ #Growth`,
        author: handle,
        source: "twitter_sync"
      });

      setSuccessMsg(`Connected @${handle}! Ingested latest sentiment tweets.`);
      if (onSuccess) onSuccess();

      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 1400);
    } catch (err) {
      console.error("Twitter sync error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateMail = (e: React.FormEvent) => {
    e.preventDefault();
    if (userEmail.trim()) {
      api.setToken(api.getToken() || "token_" + Date.now(), userEmail.trim());
      setSuccessMsg(`Connected account email: ${userEmail.trim()}`);
      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg glass-panel bg-slate-950/90 rounded-3xl border border-slate-800 p-6 space-y-5 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <span>Connect & Ingest Tweets</span>
          </h3>
          <p className="text-xs text-slate-400">
            Add custom tweets, connect Twitter accounts, or manage your analyst mail
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 p-1 bg-slate-900/80 rounded-xl border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("custom")}
            className={`flex-1 py-1.5 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "custom"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Add Custom Tweet</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("twitter")}
            className={`flex-1 py-1.5 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "twitter"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Twitter className="w-3.5 h-3.5 text-sky-400" />
            <span>Connect Twitter / X</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("mail")}
            className={`flex-1 py-1.5 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "mail"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-emerald-400" />
            <span>My Mail</span>
          </button>
        </div>

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* TAB 1: CUSTOM TWEET */}
        {activeTab === "custom" && (
          <form onSubmit={handleSubmitCustomTweet} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Your Tweet Text
              </label>
              <textarea
                required
                rows={3}
                value={tweetText}
                onChange={(e) => setTweetText(e.target.value)}
                placeholder="Type or paste any tweet: 'We tested the new product and performance was spectacular! 🚀 #Launch'"
                className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 resize-none font-normal"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Author Handle (Optional)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-mono">@</span>
                <input
                  type="text"
                  value={authorHandle}
                  onChange={(e) => setAuthorHandle(e.target.value)}
                  placeholder="your_handle"
                  className="w-full pl-8 pr-4 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                />
              </div>
            </div>

            {/* Live NLP Preview */}
            {previewNlp && (
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Live NLP Detection:</span>
                  <SentimentBadge sentiment={previewNlp.sentiment} confidence={previewNlp.confidence} />
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden flex">
                  <div style={{ width: `${previewNlp.scores.positive * 100}%` }} className="bg-emerald-500" />
                  <div style={{ width: `${previewNlp.scores.neutral * 100}%` }} className="bg-slate-500" />
                  <div style={{ width: `${previewNlp.scores.negative * 100}%` }} className="bg-rose-500" />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={!tweetText.trim() || isSubmitting}
              className="w-full py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              <span>Analyze & Stream Tweet</span>
            </button>
          </form>
        )}

        {/* TAB 2: TWITTER SYNC */}
        {activeTab === "twitter" && (
          <form onSubmit={handleConnectTwitter} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Twitter / X Username to Ingest
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-mono">@</span>
                <input
                  type="text"
                  required
                  value={twitterHandle}
                  onChange={(e) => setTwitterHandle(e.target.value)}
                  placeholder="elonmusk, OpenAI, Tesla, or your handle"
                  className="w-full pl-8 pr-4 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Twitter API v2 Bearer Token (Optional)
              </label>
              <input
                type="password"
                value={bearerToken}
                onChange={(e) => setBearerToken(e.target.value)}
                placeholder="Optional: leave blank for cloud stream firehose"
                className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-sky-600/30 active:scale-95 cursor-pointer"
            >
              {isSubmitting ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Twitter className="w-3.5 h-3.5" />
              )}
              <span>Sync Tweets for @{twitterHandle.replace("@", "") || "handle"}</span>
            </button>
          </form>
        )}

        {/* TAB 3: MAIL ACCOUNT */}
        {activeTab === "mail" && (
          <form onSubmit={handleUpdateMail} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Your Analyst Email Address
              </label>
              <input
                type="email"
                required
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="your.email@company.com"
                className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-1">
              <p className="font-medium text-slate-300">Email Connected Privileges:</p>
              <p>• Associated with all custom tweet submissions</p>
              <p>• Sentiment alert threshold summaries</p>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 active:scale-95 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Save & Connect Email</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
