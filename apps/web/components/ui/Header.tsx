"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  Twitter,
  Menu,
  X,
  Activity,
  LayoutDashboard,
  Layers,
  BarChart3,
  History,
  Database,
  Cpu,
  BookOpen,
  Info,
  Settings,
  ArrowRight
} from "lucide-react";
import { api } from "@/lib/api-client";
import { AddTweetModal } from "@/components/feed/AddTweetModal";

interface HeaderProps {
  isConnected: boolean;
  streamMode?: "websocket" | "cloud_stream";
  currentCategory?: string;
  onCategoryChange?: (category: string) => void;
  onTweetIngested?: () => void;
}

const MOBILE_NAV = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Analyze Text", href: "/analyze", icon: Sparkles },
  { label: "Batch Analysis", href: "/batch", icon: Layers },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "History", href: "/history", icon: History },
  { label: "Dataset Explorer", href: "/dataset", icon: Database },
  { label: "Model Architecture", href: "/model", icon: Cpu },
  { label: "How It Works", href: "/how-it-works", icon: BookOpen },
  { label: "About Platform", href: "/about", icon: Info },
  { label: "Settings", href: "/settings", icon: Settings },
];

export const Header: React.FC<HeaderProps> = ({
  isConnected,
  currentCategory = "all",
  onCategoryChange,
  onTweetIngested
}) => {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("analyst@sentix.ai");
  const [twitterHandle, setTwitterHandle] = useState("");

  useEffect(() => {
    setUserEmail(api.getCurrentUserEmail());
    if (typeof window !== "undefined") {
      setTwitterHandle(localStorage.getItem("pulseai_twitter_handle") || "");
    }

    const handleStorage = () => {
      setUserEmail(api.getCurrentUserEmail());
      if (typeof window !== "undefined") {
        setTwitterHandle(localStorage.getItem("pulseai_twitter_handle") || "");
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const initials = twitterHandle
    ? twitterHandle.substring(0, 2).toUpperCase()
    : userEmail.split("@")[0].substring(0, 2).toUpperCase();

  return (
    <>
      <header className="h-16 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
        {/* Left: Brand Name & Subtitle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-500 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-600/30">
              S
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white tracking-tight group-hover:text-indigo-400 transition-colors">
                  Sentix AI
                </span>
                <span className="hidden sm:inline text-[10px] px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-800 font-mono">
                  Twitter / X Sentiment Analytics
                </span>
              </div>
              <div className="hidden md:block text-[10px] text-slate-400 -mt-0.5">
                Social Sentiment Intelligence Platform
              </div>
            </div>
          </Link>

          {/* Model Status Indicator */}
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-xs ml-2">
            <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
            <span className="text-[11px] text-slate-300">
              {isConnected ? "Engine Ready" : "Connecting..."}
            </span>
          </div>
        </div>

        {/* Right: Quick Actions & Profile */}
        <div className="flex items-center gap-2.5">
          {/* Analyze Text Button */}
          <Link
            href="/analyze"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all cursor-pointer active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Analyze Text</span>
            <span className="sm:hidden">Analyze</span>
          </Link>

          {/* Twitter ID & Channel Hub Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-all cursor-pointer active:scale-95"
            title="Search Twitter ID sentiment pulse or switch firehose channel"
          >
            <Twitter className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden md:inline">X Intelligence</span>
            <span className="md:hidden">X ID</span>
          </button>

          {/* User Profile Badge */}
          <Link
            href="/settings"
            className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-800 cursor-pointer group"
            title="Account & Platform Settings"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold shadow-inner group-hover:ring-2 group-hover:ring-indigo-500 transition-all">
              {initials}
            </div>
            <div className="hidden xl:block text-left text-xs">
              <div className="font-medium text-slate-200 truncate max-w-[130px] group-hover:text-indigo-400 transition-colors">
                {twitterHandle ? `@${twitterHandle}` : userEmail}
              </div>
              <div className="text-[10px] text-slate-400">Analyst</div>
            </div>
          </Link>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden animate-fade-in">
          <div className="w-72 bg-slate-950 h-full border-r border-slate-800 p-5 space-y-6 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
                  S
                </div>
                <span className="font-bold text-white text-sm">Sentix AI</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="space-y-1">
              {MOBILE_NAV.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Twitter ID & Category Intelligence Modal */}
      <AddTweetModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setUserEmail(api.getCurrentUserEmail());
          if (typeof window !== "undefined") {
            setTwitterHandle(localStorage.getItem("pulseai_twitter_handle") || "");
          }
        }}
        currentCategory={currentCategory}
        onCategoryChange={onCategoryChange}
        onSuccess={() => {
          if (onTweetIngested) onTweetIngested();
          setUserEmail(api.getCurrentUserEmail());
          if (typeof window !== "undefined") {
            setTwitterHandle(localStorage.getItem("pulseai_twitter_handle") || "");
          }
        }}
      />
    </>
  );
};
