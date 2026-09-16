"use client";

import React, { useState } from "react";
import { api, Tweet } from "@/lib/api-client";
import { clientClassify } from "@/lib/client-nlp";
import {
  searchTwitterAccount,
  TwitterAccountProfile,
  STREAM_CATEGORIES
} from "@/lib/twitter-service";
import { SentimentBadge } from "@/components/ui/Badge";
import {
  X,
  Send,
  Sparkles,
  Twitter,
  Mail,
  CheckCircle2,
  RefreshCw,
  Search,
  Radio,
  UserCheck,
  TrendingUp,
  Activity,
  Flame,
  ArrowRight
} from "lucide-react";

interface AddTweetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  currentCategory?: string;
  onCategoryChange?: (category: string) => void;
}

export const AddTweetModal: React.FC<AddTweetModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  currentCategory = "all",
  onCategoryChange
}) => {
  const [activeTab, setActiveTab] = useState<"search" | "custom" | "categories" | "mail">("search");

  // Account search state
  const [searchHandle, setSearchHandle] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [foundProfile, setFoundProfile] = useState<TwitterAccountProfile | null>(null);
  const [isIngestingAccount, setIsIngestingAccount] = useState(false);

  // Custom tweet state
  const [tweetText, setTweetText] = useState("");
  const [authorHandle, setAuthorHandle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Mail state
  const [userEmail, setUserEmail] = useState(api.getCurrentUserEmail());

  if (!isOpen) return null;

  // Live preview sentiment for custom tweet
  const previewNlp = tweetText.trim().length > 3 ? clientClassify(tweetText) : null;

  // Search Twitter ID / Account
  const handleSearchAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchHandle.trim()) return;

    try {
      setIsSearching(true);
      const profile = await searchTwitterAccount(searchHandle.trim());
      setFoundProfile(profile);
    } catch (err) {
      console.error("Account search error:", err);
    } finally {
      setIsSearching(false);
    }
  };

  // Ingest all recent tweets from found account
  const handleIngestAccountTweets = async () => {
    if (!foundProfile) return;

    try {
      setIsIngestingAccount(true);
      for (const tweet of foundProfile.recentTweets) {
        await api.ingestTweet({
          text: tweet.text,
          author: foundProfile.handle,
          source: "x_profile_sync"
        });
      }

      setSuccessMsg(`Ingested ${foundProfile.recentTweets.length} recent tweets from @${foundProfile.handle}!`);
      if (onSuccess) onSuccess();

      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 1500);
    } catch (e) {
      console.error("Ingest error:", e);
    } finally {
      setIsIngestingAccount(false);
    }
  };

  // Connect as active user
  const handleConnectThisAccount = () => {
    if (!foundProfile) return;
    if (typeof window !== "undefined") {
      localStorage.setItem("pulseai_twitter_handle", foundProfile.handle);
      localStorage.setItem("sentiment_user_email", `${foundProfile.handle}@x.com`);
    }
    setSuccessMsg(`Linked @${foundProfile.handle} as your active Twitter profile!`);
    if (onSuccess) onSuccess();

    setTimeout(() => {
      setSuccessMsg(null);
      onClose();
    }, 1200);
  };

  // Submit custom tweet
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

      setSuccessMsg("Custom tweet published and streamed to live ticker!");
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

  // Update Email
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="w-full max-w-xl glass-panel bg-slate-950/95 rounded-3xl border border-slate-800 p-6 space-y-5 shadow-2xl relative my-8">
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
            <Twitter className="w-5 h-5 text-sky-400" />
            <span>Twitter / X Intelligence Hub</span>
          </h3>
          <p className="text-xs text-slate-400">
            Search any Twitter ID for recent tweets & sentiment pulse, switch sports/gaming stream channels, or post custom tweets
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-900/80 rounded-xl border border-slate-800 text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab("search")}
            className={`py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1 ${
              activeTab === "search"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span className="truncate">Search ID</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("categories")}
            className={`py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1 ${
              activeTab === "categories"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-rose-400" />
            <span className="truncate">Sports/Gaming</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("custom")}
            className={`py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1 ${
              activeTab === "custom"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span className="truncate">Post Tweet</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("mail")}
            className={`py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1 ${
              activeTab === "mail"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-emerald-400" />
            <span className="truncate">My Mail</span>
          </button>
        </div>

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* TAB 1: SEARCH SPECIFIC TWITTER ID / ACCOUNT & FIND PULSE */}
        {activeTab === "search" && (
          <div className="space-y-4">
            <form onSubmit={handleSearchAccount} className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-mono">@</span>
                <input
                  type="text"
                  required
                  value={searchHandle}
                  onChange={(e) => setSearchHandle(e.target.value)}
                  placeholder="elonmusk, Cristiano, OpenAI, PlayStation, or your handle..."
                  className="w-full pl-8 pr-4 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                />
              </div>

              <button
                type="submit"
                disabled={isSearching}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white transition-all flex items-center gap-1.5 shadow-md shadow-sky-600/30 cursor-pointer disabled:opacity-50"
              >
                {isSearching ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                <span>Find Pulse</span>
              </button>
            </form>

            {/* Account Profile & Sentiment Pulse Result */}
            {foundProfile ? (
              <div className="space-y-4 animate-fade-in-up">
                {/* Profile Card */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-md">
                        {foundProfile.handle.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-bold text-white">{foundProfile.name}</h4>
                          {foundProfile.verified && (
                            <span className="text-sky-400 text-xs" title="Verified Account">✓</span>
                          )}
                        </div>
                        <span className="text-xs text-slate-400">@{foundProfile.handle}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleConnectThisAccount}
                      className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1 transition-colors"
                      title="Link this as your profile"
                    >
                      <UserCheck className="w-3 h-3 text-emerald-400" />
                      <span>Link Account</span>
                    </button>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{foundProfile.bio}</p>

                  <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                    <span><strong className="text-white">{foundProfile.followersCount.toLocaleString()}</strong> Followers</span>
                    <span><strong className="text-white">{foundProfile.followingCount.toLocaleString()}</strong> Following</span>
                    <span className="capitalize px-2 py-0.5 rounded bg-slate-800 text-slate-300">Category: {foundProfile.category}</span>
                  </div>
                </div>

                {/* Sentiment Pulse Card */}
                <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-indigo-400" />
                      <span className="text-xs font-semibold text-white">Account Sentiment Pulse:</span>
                    </div>
                    <SentimentBadge sentiment={foundProfile.sentimentPulse.overallSentiment} />
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      <div className="text-xs font-bold text-emerald-400">%{foundProfile.sentimentPulse.positivePct}</div>
                      <div className="text-[10px] text-slate-400">Positive</div>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700">
                      <div className="text-xs font-bold text-slate-300">%{foundProfile.sentimentPulse.neutralPct}</div>
                      <div className="text-[10px] text-slate-400">Neutral</div>
                    </div>
                    <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
                      <div className="text-xs font-bold text-rose-400">%{foundProfile.sentimentPulse.negativePct}</div>
                      <div className="text-[10px] text-slate-400">Negative</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
                    <span>Net Sentiment Score (NSS): <strong className={foundProfile.sentimentPulse.netScore >= 0 ? "text-emerald-400" : "text-rose-400"}>{foundProfile.sentimentPulse.netScore > 0 ? `+${foundProfile.sentimentPulse.netScore}` : foundProfile.sentimentPulse.netScore}</strong></span>
                    <span className="text-[11px] text-slate-400">{foundProfile.sentimentPulse.dominantEmotion}</span>
                  </div>
                </div>

                {/* Recent Tweets Preview */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300">Recent Timeline Tweets ({foundProfile.recentTweets.length})</span>
                    <button
                      type="button"
                      onClick={handleIngestAccountTweets}
                      disabled={isIngestingAccount}
                      className="text-xs text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1"
                    >
                      {isIngestingAccount ? <RefreshCw className="w-3 h-3 animate-spin" /> : <ArrowRight className="w-3 h-3" />}
                      <span>Ingest into Dashboard Feed</span>
                    </button>
                  </div>

                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {foundProfile.recentTweets.map((t, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-400 font-mono">@{t.author}</span>
                          <SentimentBadge sentiment={t.sentiment} confidence={t.confidence} size="sm" />
                        </div>
                        <p className="text-slate-200 leading-snug">{t.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 text-center space-y-2">
                <Search className="w-8 h-8 text-slate-600 mx-auto" />
                <h4 className="text-xs font-semibold text-slate-300">Lookup any Twitter ID or User</h4>
                <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                  Try searching @Cristiano, @elonmusk, @OpenAI, @PlayStation, or your personal Twitter handle to extract their sentiment pulse.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: STREAM CATEGORIES (SPORTS, GAMING, TECH, CRYPTO) */}
        {activeTab === "categories" && (
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-semibold text-white mb-1">Select Active Live Firehose Channel</h4>
              <p className="text-xs text-slate-400">
                Filter the streaming ticker and live feed by sports, gaming, tech, or financial markets
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {STREAM_CATEGORIES.map((cat) => {
                const isSelected = currentCategory === cat.id;
                return (
                  <div
                    key={cat.id}
                    onClick={() => {
                      if (onCategoryChange) onCategoryChange(cat.id);
                      setSuccessMsg(`Switched firehose channel to ${cat.name}!`);
                      setTimeout(() => setSuccessMsg(null), 1200);
                    }}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all space-y-1.5 ${
                      isSelected
                        ? "bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-600/20"
                        : "bg-slate-900/60 hover:bg-slate-900 border-slate-800 text-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{cat.icon}</span>
                        <span className="text-xs font-bold">{cat.name}</span>
                      </div>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">{cat.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: POST CUSTOM TWEET */}
        {activeTab === "custom" && (
          <form onSubmit={handleSubmitCustomTweet} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Tweet Content
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

        {/* TAB 4: MY MAIL */}
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
