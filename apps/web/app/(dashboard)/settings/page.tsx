"use client";

import React, { useState } from "react";
import { Settings, Key, Cpu, Radio, Shield, CheckCircle2, Save } from "lucide-react";

export default function SettingsPage() {
  const [bearerToken, setBearerToken] = useState("");
  const [engineMode, setEngineMode] = useState("hybrid");
  const [autoPulse, setAutoPulse] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Platform Settings</h2>
        <p className="text-xs text-slate-400">
          Configure Twitter API integrations, NLP pipeline preferences, and system parameters
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Twitter / X API v2 Configuration */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-white">X / Twitter API v2 Credentials</h3>
          </div>
          <p className="text-xs text-slate-400">
            Optional: If no bearer token is supplied, the platform automatically switches to the built-in realistic streaming engine.
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
              Enable real-time WebSocket live ticker sound and visual pulses on new tweets
            </span>
          </label>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-2">
          {isSaved ? (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Settings updated successfully!</span>
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
