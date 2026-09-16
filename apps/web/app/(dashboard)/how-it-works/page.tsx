"use client";

import React from "react";
import Link from "next/link";
import {
  BookOpen,
  Sparkles,
  Layers,
  Cpu,
  Activity,
  CheckCircle2,
  FileText,
  BarChart2,
  ArrowRight
} from "lucide-react";

export default function HowItWorksPage() {
  const sections = [
    {
      title: "1. What is Sentiment Analysis?",
      desc: "Sentiment analysis (also known as opinion mining) is a subfield of Natural Language Processing that identifies, extracts, and quantifies affective states and subjective information from text. It classifies statements into Positive, Negative, or Neutral polarities.",
      keyPoints: [
        "Identifies user sentiment across tweets, reviews, and customer feedback",
        "Tracks public opinion shifts and Net Sentiment Score (NSS = % Pos - % Neg)",
        "Distinguishes between emotional praise, critical complaints, and objective facts"
      ]
    },
    {
      title: "2. What is NLP (Natural Language Processing)?",
      desc: "NLP represents the intersection of computer science, artificial intelligence, and computational linguistics. It enables computational systems to process, parse, and comprehend unstructured human language syntax and semantic context.",
      keyPoints: [
        "Bridges raw human language and statistical machine learning models",
        "Processes linguistic variance, colloquialisms, slang, and emojis",
        "Transforms arbitrary length text into fixed-dimensional numerical feature spaces"
      ]
    },
    {
      title: "3. How Text Preprocessing Works",
      desc: "Raw social-media text contains noise that degrades ML accuracy. Before mathematical vectorization, text passes through a multi-stage deterministic cleaning pipeline.",
      keyPoints: [
        "Noise Removal: Strips HTTP/HTTPS URLs, platform handles (@username), and special control characters",
        "Hashtag Normalization: Isolates hashtag stems (e.g. #OpenAI -> openai) for entity tracking",
        "Tokenization: Segments text strings into discrete word boundaries and structural units",
        "Stopword Filtering: Removes high-frequency, low-information words ('the', 'is', 'at', 'which') to isolate salient content"
      ]
    },
    {
      title: "4. Feature Extraction & Lexicon Polarity",
      desc: "To quantify sentiment, words and symbols are mapped to calibrated valence dictionaries and vector representations.",
      keyPoints: [
        "VADER Lexicon Scoring: Uses rules optimized for social discourse to compute compound polarity [-1.0 to +1.0]",
        "Emoji Semantic Calibration: Emojis convey intense sentiment (e.g., 🚀, 🔥 = +2.5; 😡, 💔 = -2.8) and are factored into net polarity",
        "Contextual Transformer Embeddings: RoBERTa models capture multi-word syntax, negations ('not bad' vs 'bad'), and sentence semantics"
      ]
    },
    {
      title: "5. How Classification & Prediction Work",
      desc: "Sentix AI applies an ensemble voting mechanism combining deep contextual embeddings and rule-based lexicon scoring.",
      keyPoints: [
        "Compound Scoring: Net differential between positive and negative semantic vectors",
        "Threshold Activation: Net polarity > +0.6 activates Positive; Net polarity < -0.6 activates Negative; intermediate values reflect Neutral / Objective statements",
        "Confidence Calibration: Normalizes class probabilities across 3 discrete dimensions to sum to 100%"
      ]
    },
    {
      title: "6. Model Evaluation & Benchmarking",
      desc: "Machine learning models are evaluated using standard information retrieval metrics against labeled benchmark datasets.",
      keyPoints: [
        "Accuracy: Overall proportion of correct predictions across all classes",
        "Precision: Proportion of true positive identifications out of all predicted positives",
        "Recall: Proportion of actual positive instances correctly classified by the model",
        "F1-Score: Harmonic mean of precision and recall, balancing false positives and false negatives"
      ]
    }
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-indigo-400" />
          <span>How It Works — NLP & ML Technical Guide</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          A comprehensive breakdown of natural language processing workflows, text tokenization, lexicon polarity, and ensemble classification.
        </p>
      </div>

      {/* Visual Workflow Diagram */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">End-to-End Prediction Pipeline</h3>
          <span className="text-[11px] text-slate-500 font-mono">Deterministic Execution</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-6 gap-2.5 text-xs">
          {[
            { step: "01", name: "Raw Input", desc: "Tweet / post text" },
            { step: "02", name: "Preprocessing", desc: "Clean noise & URLs" },
            { step: "03", name: "Tokenization", desc: "Segment into tokens" },
            { step: "04", name: "Extraction", desc: "Lexicon & stopwords" },
            { step: "05", name: "Scoring", desc: "Ensemble model" },
            { step: "06", name: "Pulse Result", desc: "Calibrated classes" }
          ].map((s, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-indigo-400">{s.step}</span>
              <div className="font-semibold text-white">{s.name}</div>
              <div className="text-[11px] text-slate-400">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Structured Sections */}
      <div className="space-y-4">
        {sections.map((sec, idx) => (
          <div key={idx} className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-3">
            <h3 className="text-base font-bold text-white">{sec.title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              {sec.desc}
            </p>

            <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
              {sec.keyPoints.map((pt, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* CTA to Analyzer */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-semibold text-white">Ready to test the pipeline live?</h4>
          <p className="text-xs text-slate-400">
            Open the main analyzer to inspect feature attribution and model scoring on your own text.
          </p>
        </div>
        <Link
          href="/analyze"
          className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 flex items-center gap-1.5 transition-all shrink-0 active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Launch Analyzer</span>
        </Link>
      </div>
    </div>
  );
}
