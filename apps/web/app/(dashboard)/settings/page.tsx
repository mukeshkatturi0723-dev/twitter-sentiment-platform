"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api-client";
import {
  Settings,
  Key,
  Cpu,
  Radio,
  Mail,
  Twitter,
  CheckCircle2,
  Save,
  Trash2,
  ShieldAlert,
  Activity,
  Info
} from "lucide-react";

export default function SettingsPage() {
  const [userEmail, setUserEmail] = useState("");
  const [twitterHandle, setTwitterHandle] = useState("");
  const [bearerToken, setBearerToken] = useState("");
  const [engineMode, setEngineMode] = useState("hybrid");
  const [autoPulse, setAutoPulse] = useState(true);
  const [systemHealth, setSystemHealth] = useState<{ apiOnline: boolean; modelReady: boolean; mode: string }>({
    apiOnline: true,
    modelReady: true,
    mode: "Cloud Resilient Ensemble"
  });
  const [isSaved, setIsSaved] = useState(false);
  const [historyClearedMsg, setHistoryClearedMsg] = useState(false);

  useEffect(() => {
    setUserEmail(api.getCurrentUserEmail());
    if (typeof window !== "undefined") {
      const storedHandle = localStorage.getItem("pulseai_twitter_handle") || "";
      const storedToken = localStorage.getItem("pulseai_twitter_token") || "";
      const storedEngine = localStorage.getItem("sentix_engine_mode") || "hybrid";
      setTwitterHandle(storedHandle);
      setBearerToken(storedToken);
      setEngineMode(storedEngine);
    }

    api.getSystemHealth().then(setSystemHealth).catch(() => {});
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (userEmail.trim()) {
      api.setToken(api.getToken() || "token_" + Date.now(), userEmail.trim());
    }
    if (typeof window !== "undefined") {
      localStorage.setItem("pulseai_twitter_handle", twitterHandle.trim());
      localStorage.setItem("pulseai_twitter_token", bearerToken.trim());
      localStorage.setItem("sentix_engine_mode", engineMode);
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleClearHistory = () => {
    if (confirm("Are you sure you want to delete all stored analysis history from your browser?")) {
      api.clearHistory();
      setHistoryClearedMsg(true);
      setTimeout(() => setHistoryClearedMsg(false), 3000);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-indigo-400" />
          <span>Platform Settings & System Status</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Configure connected accounts, NLP classification engine strategy, and privacy preferences.
        </p>
      </div>

      {/* System Health Status Banner */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Activity className="w-4 h-4 text-indigo-400" />
          <span>System Status</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">API Status</span>
            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Online</span>
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">Model Engine</span>
            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Ready</span>
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">Version</span>
            <span className="text-slate-200">Sentix AI v2.4.0</span>
          </div>
        </div>
      </div>

      {/* Privacy Notice Card */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3 text-xs text-slate-400">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1 leading-relaxed">
          <div className="font-semibold text-slate-200">Data Privacy & Handling Notice</div>
          <p>
            Your text is processed strictly to generate sentiment classification. Avoid submitting passwords, personal identifiers, financial information, or other sensitive confidential data. Local history is stored locally in your browser.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Connected Mail & Analyst Account */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-white">Connected Analyst Mail</h3>
          </div>
          <p className="text-xs text-slate-400">
            Active email address associated with your dashboard sessions and report exports.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Your Email Address
              </label>
              <input
                type="email"
                required
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="analyst@sentix.ai"
                className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 font-normal"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Connected Twitter / X Handle
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-mono">@</span>
                <input
                  type="text"
                  value={twitterHandle}
                  onChange={(e) => setTwitterHandle(e.target.value)}
                  placeholder="your_handle"
                  className="w-full pl-8 pr-4 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                />
              </div>
            </div>
          </div>
        </div>

        {/* NLP Engine Selector */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-white">NLP Classification Strategy</h3>
          </div>
          <p className="text-xs text-slate-400">
            Select the classification engine strategy. Hybrid balances speed and deep transformer contextual scoring.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                id: "hybrid",
                title: "Hybrid Ensemble (Recommended)",
                desc: "High-confidence RoBERTa contextual scoring with fast VADER tie-breaker fallback"
              },
              {
                id: "transformer",
                title: "RoBERTa / DistilBERT Only",
                desc: "Deep contextual transformer scoring (cardiffnlp/twitter-roberta-base)"
              },
              {
                id: "vader",
                title: "VADER Lexicon Only",
                desc: "Fast rule-based lexicon scoring optimized for social media firehose"
              },
            ].map((option) => (
              <div
                key={option.id}
                onClick={() => setEngineMode(option.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  engineMode === option.id
                    ? "bg-indigo-600/15 border-indigo-500/40 text-white shadow-sm"
                    : "bg-slate-900/60 hover:bg-slate-900 border-slate-800 text-slate-300"
                }`}
              >
                <div className="text-xs font-semibold mb-1">{option.title}</div>
                <div className="text-[11px] text-slate-400 leading-relaxed">{option.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Twitter / X API v2 Configuration */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-semibold text-white">Twitter / X API v2 Credentials (Optional)</h3>
          </div>
          <p className="text-xs text-slate-400">
            Optional: Enter your Twitter Bearer Token to connect official streaming firehose. If left blank, Sentix AI streams via the high-fidelity cloud engine.
          </p>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Twitter Bearer Token
            </label>
            <input
              type="password"
              value={bearerToken}
              onChange={(e) => setBearerToken(e.target.value)}
              placeholder="AAAAAAAAAAAAAAAAAAAAAMLArwAAAAAA..."
              className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-sky-500/50 font-mono"
            />
          </div>
        </div>

        {/* Local History Management */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-rose-400" />
                <span>Local Storage & History Cache</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Clear all locally stored analysis logs, custom tweets, and cached metrics from your browser.
              </p>
            </div>

            <button
              type="button"
              onClick={handleClearHistory}
              className="px-3.5 py-2 rounded-xl text-xs font-medium bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors shrink-0"
            >
              Clear Local History
            </button>
          </div>

          {historyClearedMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Local analysis history cleared successfully.</span>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-2">
          {isSaved ? (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span>Preferences saved successfully!</span>
            </div>
          ) : <span />}

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/30 flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
}
