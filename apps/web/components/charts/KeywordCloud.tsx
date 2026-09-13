"use client";

import React from "react";
import { KeywordItem } from "@/lib/api-client";
import { Hash } from "lucide-react";

interface KeywordCloudProps {
  keywords: KeywordItem[];
  onSelectKeyword?: (kw: string) => void;
}

export const KeywordCloud: React.FC<KeywordCloudProps> = ({
  keywords,
  onSelectKeyword
}) => {
  if (!keywords || keywords.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-slate-500">
        No keywords extracted yet.
      </div>
    );
  }

  const maxCount = Math.max(...keywords.map((k) => k.count), 1);

  return (
    <div className="p-2 flex flex-wrap gap-2 items-center justify-center content-center min-h-[16rem]">
      {keywords.map((item, idx) => {
        const weightRatio = item.count / maxCount;
        
        // Font size scaling between 11px and 16px
        const fontSize = Math.max(11, Math.min(16, 11 + weightRatio * 6));

        const colorClasses = {
          positive: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20",
          negative: "bg-rose-500/10 text-rose-300 border-rose-500/30 hover:bg-rose-500/20",
          neutral: "bg-slate-500/10 text-slate-300 border-slate-500/30 hover:bg-slate-500/20"
        }[item.sentiment_dominant] || "bg-indigo-500/10 text-indigo-300 border-indigo-500/30";

        return (
          <button
            key={idx}
            onClick={() => onSelectKeyword && onSelectKeyword(item.keyword)}
            style={{ fontSize: `${fontSize}px` }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all duration-150 cursor-pointer active:scale-95 ${colorClasses}`}
            title={`${item.keyword}: ${item.count} mentions (${(item.positive_ratio * 100).toFixed(0)}% positive)`}
          >
            <span className="opacity-60">#</span>
            <span className="font-semibold">{item.keyword.replace(/^#/, "")}</span>
            <span className="text-[10px] font-mono opacity-70 ml-0.5 px-1 py-0.2 rounded bg-black/30">
              {item.count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
