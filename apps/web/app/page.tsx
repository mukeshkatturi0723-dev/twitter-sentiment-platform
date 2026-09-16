"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  BarChart3,
  ArrowRight,
  Layers,
  Database,
  Cpu,
  CheckCircle2,
  Smile,
  Frown,
  Meh,
  Activity,
  FileText
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#06090f] text-slate-100 flex flex-col justify-between selection:bg-indigo-500/30">
      {/* Top Navigation */}
      <header className="h-16 border-b border-slate-800/70 bg-slate-950/60 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-500 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-600/30">
            S
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white tracking-tight text-base">Sentix AI</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-800 font-mono">
                NLP Intelligence
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <Link
            href="/dashboard"
            className="hidden sm:inline-block text-slate-400 hover:text-slate-200 transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/how-it-works"
            className="hidden sm:inline-block text-slate-400 hover:text-slate-200 transition-colors"
          >
            How It Works
          </Link>
          <Link
            href="/analyze"
            className="px-4 py-2 rounded-xl font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
          >
            <span>Launch Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 sm:py-24 text-center max-w-5xl mx-auto space-y-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium animate-fade-in">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Social Sentiment Intelligence Platform</span>
        </div>

        {/* Hero Headings */}
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Understand What People Feel.
          </h1>
          <p className="text-sm sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto font-normal">
            Analyze social-media text with NLP and machine learning to uncover positive, negative, and neutral sentiment.
          </p>
        </div>

        {/* Primary & Secondary Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md pt-2">
          <Link
            href="/analyze"
            className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>Analyze Text</span>
          </Link>

          <Link
            href="/analytics"
            className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-medium bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <BarChart3 className="w-4 h-4 text-slate-400" />
            <span>Explore Analytics</span>
          </Link>
        </div>

        {/* Interactive Architecture Flow Preview */}
        <div className="w-full max-w-4xl pt-8">
          <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800/90 text-left space-y-6 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                  Production NLP Architecture
                </span>
                <h3 className="text-sm font-bold text-white">
                  Text → NLP Processing → Feature Extraction → ML Model → Sentiment → Analytics
                </h3>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono self-start sm:self-auto">
                Ready
              </span>
            </div>

            {/* 6 Step Interactive Visual Pipeline */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-xs">
              {[
                { step: "01", title: "Input Text", desc: "Tweet / post ingest", icon: FileText },
                { step: "02", title: "Text Cleaning", desc: "URL & mention filter", icon: Activity },
                { step: "03", title: "Tokenization", desc: "Word boundaries", icon: Layers },
                { step: "04", title: "Feature Extraction", desc: "Lexicon & keywords", icon: Database },
                { step: "05", title: "ML Classifier", desc: "Ensemble scoring", icon: Cpu },
                { step: "06", title: "Result & Pulse", desc: "Calibrated probability", icon: CheckCircle2 },
              ].map((stage, idx) => {
                const Icon = stage.icon;
                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/90 space-y-1.5 relative group hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center justify-between text-slate-400 font-mono text-[10px]">
                      <span>{stage.step}</span>
                      <Icon className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="font-semibold text-slate-200 text-xs">{stage.title}</div>
                    <div className="text-[11px] text-slate-400 leading-tight">{stage.desc}</div>
                  </div>
                );
              })}
            </div>

            {/* Live Sample Preview Bar */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <span className="text-[11px] text-slate-400 font-mono">Sample Detection:</span>
                <p className="text-slate-200 font-medium">
                  &ldquo;The engineering team achieved a 45% reduction in inference latency today! Outstanding speed. 🚀✨&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1">
                  <Smile className="w-3.5 h-3.5" />
                  <span>Positive</span>
                  <span className="opacity-75 font-mono text-[10px]">94%</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-6 px-6 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3 max-w-6xl mx-auto w-full">
        <div>
          <span>Sentix AI &copy; 2026. Social Sentiment Intelligence Platform.</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <Link href="/how-it-works" className="hover:text-slate-200 transition-colors">
            Methodology
          </Link>
          <Link href="/model" className="hover:text-slate-200 transition-colors">
            Model Specs
          </Link>
          <Link href="/dataset" className="hover:text-slate-200 transition-colors">
            Dataset
          </Link>
          <Link href="/about" className="hover:text-slate-200 transition-colors">
            About
          </Link>
        </div>
      </footer>
    </div>
  );
}
