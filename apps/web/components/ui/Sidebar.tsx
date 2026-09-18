"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Hash,
  Sparkles,
  Bookmark,
  Settings,
  Activity,
  Feather,
  CheckCircle2,
  LogOut,
  Twitter
} from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api-client";

// Streamlined, focused 5 core options (Twitter style)
const NAV_ITEMS = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Explore", href: "/analytics", icon: Hash },
  { label: "Analyze", href: "/analyze", icon: Sparkles },
  { label: "History", href: "/history", icon: Bookmark },
  { label: "Settings", href: "/settings", icon: Settings },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [userEmail, setUserEmail] = useState("analyst@sentix.ai");
  const [twitterHandle, setTwitterHandle] = useState("analyst");
  const [systemStatus, setSystemStatus] = useState("Ready");

  useEffect(() => {
    setUserEmail(api.getCurrentUserEmail());
    if (typeof window !== "undefined") {
      const handle = localStorage.getItem("pulseai_twitter_handle");
      if (handle) setTwitterHandle(handle);
    }
    api.getSystemHealth().then((h) => {
      setSystemStatus(h.modelReady ? "Ready" : "Standby");
    }).catch(() => setSystemStatus("Ready"));
  }, []);

  const initial = twitterHandle ? twitterHandle.charAt(0).toUpperCase() : "A";

  return (
    <aside className="w-20 xl:w-64 border-r border-[#2f3336] flex flex-col justify-between shrink-0 h-screen sticky top-0 p-3 xl:p-4 select-none">
      <div className="space-y-4">
        {/* Twitter / Sentix Brand Logo */}
        <div className="flex items-center gap-3 px-3 py-2">
          <Link
            href="/dashboard"
            className="w-10 h-10 rounded-full hover:bg-neutral-800/80 flex items-center justify-center transition-colors text-white"
            title="Sentix AI Home"
          >
            <div className="w-8 h-8 rounded-full bg-[#1d9bf0] flex items-center justify-center text-white font-black text-base shadow-sm">
              <Twitter className="w-5 h-5 fill-current" />
            </div>
          </Link>
          <div className="hidden xl:block">
            <Link href="/dashboard" className="font-extrabold text-white text-lg tracking-tight hover:text-[#1d9bf0] transition-colors block">
              Sentix
            </Link>
            <span className="text-[11px] text-neutral-500 font-medium block -mt-1">
              Sentiment Intelligence
            </span>
          </div>
        </div>

        {/* Navigation Items (Twitter-style pill links) */}
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-4 px-3.5 py-3 rounded-full text-base transition-all duration-150 group",
                  isActive
                    ? "font-bold text-white bg-white/[0.08]"
                    : "font-normal text-neutral-300 hover:bg-white/[0.05] hover:text-white"
                )}
              >
                <Icon
                  className={cn(
                    "w-6 h-6 shrink-0 transition-transform group-hover:scale-110",
                    isActive ? "text-[#1d9bf0]" : "text-neutral-400 group-hover:text-white"
                  )}
                />
                <span className="hidden xl:inline text-[16px]">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Primary Action Button: "Analyze Tweet" (Twitter-style Post button) */}
        <div className="pt-2">
          <Link
            href="/analyze"
            className="w-full h-12 rounded-full bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-bold flex items-center justify-center transition-all shadow-md active:scale-95 text-base"
          >
            <Feather className="w-5 h-5 xl:hidden" />
            <span className="hidden xl:inline">Analyze Tweet</span>
          </Link>
        </div>
      </div>

      {/* Bottom Profile Pill */}
      <div className="space-y-3">
        {/* Model Status Badge */}
        <div className="hidden xl:flex items-center justify-between px-3 py-2 rounded-xl bg-[#16181c] border border-[#2f3336] text-xs">
          <div className="flex items-center gap-1.5 text-neutral-400">
            <Activity className="w-3.5 h-3.5 text-[#1d9bf0]" />
            <span className="text-[11px]">Engine Status</span>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] text-[#00ba7c] font-medium font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ba7c] animate-pulse" />
            <span>{systemStatus}</span>
          </span>
        </div>

        {/* User Account Card */}
        <Link
          href="/settings"
          className="flex items-center justify-between p-2.5 rounded-full hover:bg-white/[0.06] transition-colors cursor-pointer group"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#1d9bf0] to-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow">
              {initial}
            </div>
            <div className="hidden xl:block min-w-0 text-left">
              <div className="font-bold text-white text-sm truncate group-hover:underline">
                @{twitterHandle}
              </div>
              <div className="text-[12px] text-neutral-500 truncate">
                {userEmail}
              </div>
            </div>
          </div>
          <div className="hidden xl:block text-neutral-500 group-hover:text-white">
            ···
          </div>
        </Link>
      </div>
    </aside>
  );
};
