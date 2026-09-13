import React from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  variant?: "positive" | "negative" | "neutral" | "default";
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  change,
  changeLabel = "vs last week",
  icon,
  variant = "default",
  className
}) => {
  const borderVariants = {
    positive: "hover:border-emerald-500/40",
    negative: "hover:border-rose-500/40",
    neutral: "hover:border-slate-500/40",
    default: "hover:border-indigo-500/40"
  }[variant];

  const iconBg = {
    positive: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    negative: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    neutral: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    default: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
  }[variant];

  return (
    <div className={cn("glass-panel rounded-xl p-5 border transition-all duration-200", borderVariants, className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</span>
        {icon && (
          <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center border", iconBg)}>
            {icon}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-3xl font-bold tracking-tight text-white">{value}</span>
        {subtitle && <span className="text-xs text-slate-400">{subtitle}</span>}
      </div>

      {change !== undefined && (
        <div className="mt-3 flex items-center gap-1.5 text-xs">
          {change > 0 ? (
            <span className="flex items-center text-emerald-400 font-medium">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
              +{change.toFixed(1)}%
            </span>
          ) : change < 0 ? (
            <span className="flex items-center text-rose-400 font-medium">
              <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
              {change.toFixed(1)}%
            </span>
          ) : (
            <span className="flex items-center text-slate-400">
              <Minus className="w-3.5 h-3.5 mr-0.5" />
              0.0%
            </span>
          )}
          <span className="text-slate-500">{changeLabel}</span>
        </div>
      )}
    </div>
  );
};
