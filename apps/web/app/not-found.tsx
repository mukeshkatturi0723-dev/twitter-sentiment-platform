import React from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#06090f] text-slate-100 flex flex-col items-center justify-center p-4 text-center">
      <div className="w-full max-w-md glass-panel rounded-3xl p-8 border border-slate-800 space-y-6 shadow-2xl">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto border border-indigo-500/20 font-mono font-bold text-lg">
          404
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white tracking-tight">This page doesn&apos;t exist.</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            The URL you entered may be incorrect, or the page has moved to another destination on the platform.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/dashboard"
            className="w-full py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
