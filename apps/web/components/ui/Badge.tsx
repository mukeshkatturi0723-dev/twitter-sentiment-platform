import React from "react";
import { cn } from "@/lib/utils";
import { Smile, Frown, Meh, AlertCircle } from "lucide-react";

interface BadgeProps {
  sentiment: "positive" | "negative" | "neutral" | string;
  confidence?: number;
  className?: string;
  size?: "sm" | "md";
  showIcon?: boolean;
}

export const SentimentBadge: React.FC<BadgeProps> = ({
  sentiment,
  confidence,
  className,
  size = "md",
  showIcon = true
}) => {
  const norm = sentiment.toLowerCase();
  
  const styles = {
    positive: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
    negative: "bg-rose-500/15 text-rose-400 border border-rose-500/30",
    neutral: "bg-amber-500/15 text-amber-400 border border-amber-500/30"
  }[norm] || "bg-indigo-500/15 text-indigo-400 border border-indigo-500/30";

  const sizeClass = size === "sm" ? "text-[11px] px-2 py-0.5" : "text-xs px-2.5 py-1";

  const dotColor = {
    positive: "bg-emerald-400",
    negative: "bg-rose-400",
    neutral: "bg-amber-400"
  }[norm] || "bg-indigo-400";

  const Icon = {
    positive: Smile,
    negative: Frown,
    neutral: Meh
  }[norm] || AlertCircle;

  return (
    <span className={cn("inline-flex items-center gap-1.5 font-medium rounded-full uppercase tracking-wider", styles, sizeClass, className)}>
      {showIcon ? (
        <Icon className="w-3.5 h-3.5 shrink-0" />
      ) : (
        <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", dotColor)} />
      )}
      <span>{norm}</span>
      {confidence !== undefined && (
        <span className="opacity-75 font-mono text-[10px] ml-0.5">
          {(confidence * 100).toFixed(0)}%
        </span>
      )}
    </span>
  );
};
