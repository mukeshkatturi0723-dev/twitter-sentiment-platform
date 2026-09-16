"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sparkles,
  Layers,
  BarChart3,
  History,
  Database,
  Cpu,
  BookOpen,
  Info,
  Settings,
  Activity,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api-client";

const PRIMARY_NAV = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Analyze", href: "/analyze", icon: Sparkles },
  { label: "Batch Analysis", href: "/batch", icon: Layers },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "History", href: "/history", icon: History },
  { label: "Dataset", href: "/dataset", icon: Database },
  { label: "Model Info", href: "/model", icon: Cpu },
  { label: "How It Works", href: "/how-it-works", icon: BookOpen },
  { label: "About", href: "/about", icon: Info },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [systemStatus, setSystemStatus] = useState<string>("Ready");

  useEffect(() => {
    api.getSystemHealth().then(h => {
      setSystemStatus(h.modelReady ? "Ready" : "Standby");
    }).catch(() => setSystemStatus("Ready"));
  }, []);

  return (
    <aside className="w-64 border-r border-slate-800/80 bg-slate-950/90 flex flex-col justify-between shrink-0 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* Navigation list */}
        <div className="space-y-1">
          <div className="px-3 text-[11px] font-semibold tracking-wider text-slate-400 uppercase mb-2">
            Intelligence Platform
          </div>

          <nav className="space-y-1">
            {PRIMARY_NAV.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group relative",
                    isActive
                      ? "bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 shadow-sm"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                  )}
                >
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 bg-indigo-500 rounded-r-full" />
                  )}
                  <Icon
                    className={cn(
                      "w-4 h-4 transition-colors shrink-0",
                      isActive ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-200"
                    )}
                  />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Section: Settings & Model Status */}
      <div className="p-4 border-t border-slate-800/60 space-y-3">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all",
            pathname === "/settings"
              ? "bg-indigo-600/15 text-indigo-300 border border-indigo-500/30"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
          )}
        >
          <Settings className="w-4 h-4 shrink-0 text-slate-400" />
          <span>Settings</span>
        </Link>

        {/* System Health Status */}
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-medium text-slate-300 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-indigo-400" />
              <span>Model Engine</span>
            </span>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{systemStatus}</span>
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-snug">
            Sentix RoBERTa + Lexicon Hybrid
          </p>
        </div>
      </div>
    </aside>
  );
};
