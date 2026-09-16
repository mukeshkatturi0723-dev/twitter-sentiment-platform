"use client";

import React from "react";
import Link from "next/link";
import {
  Info,
  Sparkles,
  Layers,
  Cpu,
  Code2,
  CheckCircle2,
  ExternalLink,
  Github,
  Globe
} from "lucide-react";

export default function AboutPage() {
  const technologies = [
    { name: "Next.js 14", desc: "React framework with App Router, SSR, and optimized production bundler", category: "Frontend" },
    { name: "TypeScript", desc: "Type-safe interface contracts and resilient client state management", category: "Language" },
    { name: "Tailwind CSS", desc: "Utility-first CSS design system with custom dark surface tokens", category: "Styling" },
    { name: "Recharts", desc: "Composable SVG charting library for timelines and distribution donuts", category: "Visualization" },
    { name: "Python 3.11+", desc: "FastAPI asynchronous REST API gateway and WebSocket streaming manager", category: "Backend" },
    { name: "NLTK & VADER", desc: "Natural Language Toolkit with social-media compound polarity analyzer", category: "NLP & ML" },
    { name: "RoBERTa Transformers", desc: "Deep contextual language model (twitter-roberta-base-sentiment)", category: "Deep Learning" },
    { name: "SQLAlchemy & SQLite/Postgres", desc: "Relational ORM for tweet persistence, user auth, and analytics aggregations", category: "Database" },
    { name: "Vercel", desc: "Cloud serverless platform hosting global edge CDN and web assets", category: "Deployment" }
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Info className="w-6 h-6 text-indigo-400" />
          <span>About Sentix AI</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Mission, architecture, and technology stack of the Social Sentiment Intelligence Platform.
        </p>
      </div>

      {/* Mission Card */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-4 shadow-xl">
        <span className="text-[11px] font-mono text-indigo-400 uppercase tracking-wider">
          Platform Overview
        </span>
        <h3 className="text-xl font-bold text-white leading-snug">
          Empowering real-time sentiment discovery through multi-tier natural language processing.
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed font-normal">
          Sentix AI is an enterprise-grade NLP sentiment intelligence platform developed to process, classify, and visualize subjective discourse in social-media text. By pairing deep contextual transformer models with fast lexicon polarity scoring and emoji semantic calibration, the system delivers high accuracy with sub-second response times.
        </p>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-2">
          <div className="font-semibold text-white">The Sentix AI Pipeline:</div>
          <div className="flex flex-wrap items-center gap-2 text-slate-400 font-mono text-[11px]">
            <span>Text Preprocessing</span>
            <span className="text-indigo-400">&rarr;</span>
            <span>Feature Extraction</span>
            <span className="text-indigo-400">&rarr;</span>
            <span>Machine Learning</span>
            <span className="text-indigo-400">&rarr;</span>
            <span>Sentiment Classification</span>
            <span className="text-indigo-400">&rarr;</span>
            <span>Executive Analytics</span>
          </div>
        </div>
      </div>

      {/* Technology Stack Grid */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Technologies Used</h3>
            <p className="text-xs text-slate-400">Core software stack powering the application</p>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-mono">
            Full-Stack Monorepo
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          {technologies.map((tech, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">{tech.name}</span>
                <span className="text-[10px] font-mono text-slate-500 uppercase">{tech.category}</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">{tech.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Portfolio & Project Context */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-semibold text-white">Open Source & Portfolio Project</h4>
          <p className="text-xs text-slate-400">
            Engineered as a production-quality portfolio application demonstrating applied machine learning, NLP, and modern full-stack development.
          </p>
        </div>

        <a
          href="https://github.com/mukeshkatturi0723-dev/twitter-sentiment-platform"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 flex items-center gap-2 transition-colors shrink-0"
        >
          <Github className="w-4 h-4" />
          <span>View GitHub Repository</span>
          <ExternalLink className="w-3 h-3 text-slate-500" />
        </a>
      </div>
    </div>
  );
}
