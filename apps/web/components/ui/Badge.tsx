import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  sentiment: "positive" | "negative" | "neutral" | string;
  confidence?: number;
  className?: string;
  size?: "sm" | "md";
}

export const SentimentBadge: React.FC<BadgeProps> = ({
  sentiment,
  confidence,
  className,
  size = "md"
}) => {
  const norm = sentiment.toLowerCase();
  
  const styles = {
    positive: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 glow-positive",
    negative: "bg-rose-500/15 text-rose-400 border border-rose-500/30 glow-negative",
    neutral: "bg-slate-500/15 text-slate-300 border border-slate-500/30 glow-neutral"
  }[norm] || "bg-blue-500/15 text-blue-400 border border-blue-500/30";

  const sizeClass = size === "sm" ? "text-xs px-2 py-0.5" : "text-xs px-2.5 py-1";

  const dotColor = {
    positive: "bg-emerald-400",
    negative: "bg-rose-400",
    neutral: "bg-slate-400"
  }[norm] || "bg-blue-400";

  return (
    <span className={cn("inline-flex items-center gap-1.5 font-medium rounded-full uppercase tracking-wider", styles, sizeClass, className)}>
      <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", dotColor)} />
      {norm}
      {confidence !== undefined && (
        <span className="opacity-70 font-mono text-[10px] ml-0.5">
          {(confidence * 100).toFixed(0)}%
        </span>
      )}
    </span>
  );
};
