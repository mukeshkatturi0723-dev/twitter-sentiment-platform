"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Twitter,
  Menu,
  X,
  Sparkles,
  Home,
  Hash,
  Bookmark,
  Settings,
  Activity
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
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Explore & Trends", href: "/analytics", icon: Hash },
  { label: "Analyze Text", href: "/analyze", icon: Sparkles },
  { label: "History", href: "/history", icon: Bookmark },
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
  const [twitterHandle, setTwitterHandle] = useState("analyst");

  useEffect(() => {
    setUserEmail(api.getCurrentUserEmail());
    if (typeof window !== "undefined") {
      const h = localStorage.getItem("pulseai_twitter_handle");
      if (h) setTwitterHandle(h);
    }
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const initials = twitterHandle
    ? twitterHandle.substring(0, 2).toUpperCase()
    : "AN";

  return (
    <>
      {/* Slim Header: Visible on mobile/tablet (hidden on lg+ where Twitter 3-col layout is active) */}
      <header className="lg:hidden h-14 border-b border-[#2f3336] bg-black/80 backdrop-blur-md px-4 flex items-center justify-between sticky top-0 z-40">
        {/* Left: Mobile menu toggle + avatar */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#1d9bf0] to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow cursor-pointer"
            aria-label="Open profile and navigation"
          >
            {initials}
          </button>
        </div>

        {/* Center: Twitter Bird Logo */}
        <Link href="/dashboard" className="flex items-center gap-1.5 text-white">
          <div className="w-8 h-8 rounded-full bg-[#1d9bf0] flex items-center justify-center text-white shadow-sm">
            <Twitter className="w-4 h-4 fill-current" />
          </div>
          <span className="font-extrabold text-white text-base tracking-tight">Sentix</span>
        </Link>

        {/* Right: Quick Tweet / Analyze action */}
        <div className="flex items-center gap-2">
          <Link
            href="/analyze"
            className="px-3 py-1 rounded-full bg-[#1d9bf0] text-white font-bold text-xs shadow-sm hover:bg-[#1a8cd8] transition-colors"
          >
            Analyze
          </Link>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm lg:hidden animate-fade-in">
          <div className="w-72 bg-[#000000] h-full border-r border-[#2f3336] p-5 space-y-6 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#2f3336]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#1d9bf0] to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                  {initials}
                </div>
                <div>
                  <div className="font-bold text-white text-sm">@{twitterHandle}</div>
                  <div className="text-xs text-neutral-500">{userEmail}</div>
                </div>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-neutral-400 hover:text-white p-1"
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
                    className={`flex items-center gap-3.5 px-3 py-2.5 rounded-full text-base font-medium transition-all ${
                      isActive
                        ? "text-white font-bold bg-white/[0.08]"
                        : "text-neutral-300 hover:bg-white/[0.05]"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? "text-[#1d9bf0]" : "text-neutral-400"}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-[#2f3336]">
              <Link
                href="/analyze"
                className="w-full py-2.5 rounded-full bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-bold text-sm flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Analyze Tweet</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Modal for adding/ingesting tweet */}
      <AddTweetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentCategory={currentCategory}
        onCategoryChange={onCategoryChange}
        onSuccess={() => {
          if (onTweetIngested) onTweetIngested();
        }}
      />
    </>
  );
};
