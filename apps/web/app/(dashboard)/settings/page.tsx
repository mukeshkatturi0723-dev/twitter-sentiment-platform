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
  User
} from "lucide-react";

export default function SettingsPage() {
  const [userEmail, setUserEmail] = useState("");
  const [twitterHandle, setTwitterHandle] = useState("");
  const [bearerToken, setBearerToken] = useState("");
  const [engineMode, setEngineMode] = useState("hybrid");
  const [autoPulse, setAutoPulse] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setUserEmail(api.getCurrentUserEmail());
    if (typeof window !== "undefined") {
      const storedHandle = localStorage.getItem("pulseai_twitter_handle") || "";
      const storedToken = localStorage.getItem("pulseai_twitter_token") || "";
      setTwitterHandle(storedHandle);
      setBearerToken(storedToken);
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (userEmail.trim()) {
      api.setToken(api.getToken() || "token_" + Date.now(), userEmail.trim());
    }
    if (typeof window !== "undefined") {
      localStorage.setItem("pulseai_twitter_handle", twitterHandle.trim());
      localStorage.setItem("pulseai_twitter_token", bearerToken.trim());
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Platform Settings</h2>
        <p className="text-xs text-slate-400">
          Configure your connected mail, Twitter integrations, and NLP pipeline preferences
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Connected Mail & Analyst Account */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-white">Connected Analyst Mail</h3>
          </div>
          <p className="text-xs text-slate-400">
            Your active analyst email associated with all custom tweet submissions, reports, and sentiment alerts.
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
                placeholder="analyst@sentiment.ai"
                className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Your Twitter / X Handle
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

        {/* Twitter / X API v2 Configuration */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-white">X / Twitter API v2 Credentials</h3>
          </div>
          <p className="text-xs text-slate-400">
            Optional: Enter your Twitter Bearer token to connect your production stream. If empty, the platform automatically streams through the built-in realistic cloud engine.
          </p>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Twitter Bearer Token
              </label>
              <input
                type="password"
                value={bearerToken}
                onChange={(e) => setBearerToken(e.target.value)}
                placeholder="AAAAAAAAAAAAAAAAAAAAAMLArwAAAAAA..."
                className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 font-mono"
              />
            </div>
          </div>
        </div>

        {/* NLP Engine Selector */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-white">NLP Classification Engine</h3>
          </div>
          <p className="text-xs text-slate-400">
            Select the classification engine strategy. Hybrid balances speed and deep RoBERTa accuracy.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                id: "hybrid",
                title: "Hybrid Ensemble (Recommended)",
                desc: "High-confidence RoBERTa with fast VADER tie-breaker fallback"
              },
              {
                id: "transformer",
                title: "RoBERTa / DistilBERT Only",
                desc: "Full deep transformer contextual scoring"
              },
              {
                id: "vader",
                title: "VADER Lexicon Only",
                desc: "Ultra-fast rule-based sentiment scoring for high-throughput streams"
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

        {/* Streaming & Ticker Settings */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-white">Live Stream Ticker Preferences</h3>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={autoPulse}
              onChange={(e) => setAutoPulse(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-800 bg-slate-900"
            />
            <span className="text-xs text-slate-300">
              Enable real-time WebSocket live ticker pulses and incoming stream events
            </span>
          </label>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-2">
          {isSaved ? (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span>Settings and Connected Mail updated successfully!</span>
            </div>
          ) : <span />}

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/30 flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
}
