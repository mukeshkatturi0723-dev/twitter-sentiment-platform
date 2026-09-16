"use client";

import React, { useState, useEffect } from "react";
import { Radio, Zap, Plus, User, Search, Twitter } from "lucide-react";
import { api } from "@/lib/api-client";
import { AddTweetModal } from "@/components/feed/AddTweetModal";
import { STREAM_CATEGORIES } from "@/lib/twitter-service";

interface HeaderProps {
  isConnected: boolean;
  streamMode?: "websocket" | "cloud_stream";
  currentCategory?: string;
  onCategoryChange?: (category: string) => void;
  onTweetIngested?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isConnected,
  streamMode = "cloud_stream",
  currentCategory = "all",
  onCategoryChange,
  onTweetIngested
}) => {
  const [isPulsing, setIsPulsing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("analyst@sentiment.ai");
  const [twitterHandle, setTwitterHandle] = useState("");

  useEffect(() => {
    setUserEmail(api.getCurrentUserEmail());
    if (typeof window !== "undefined") {
      const h = localStorage.getItem("pulseai_twitter_handle") || "";
      setTwitterHandle(h);
    }

    const handleStorageChange = () => {
      setUserEmail(api.getCurrentUserEmail());
      if (typeof window !== "undefined") {
        setTwitterHandle(localStorage.getItem("pulseai_twitter_handle") || "");
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleTriggerSample = async () => {
    try {
      setIsPulsing(true);
      await api.triggerLiveSample();
      if (onTweetIngested) onTweetIngested();
    } catch (e) {
      console.error("Trigger live sample failed:", e);
    } finally {
      setTimeout(() => setIsPulsing(false), 600);
    }
  };

  // User initials or handle display
  const displayName = twitterHandle ? `@${twitterHandle}` : userEmail;
  const initials = twitterHandle
    ? twitterHandle.substring(0, 2).toUpperCase()
    : userEmail.split("@")[0].substring(0, 2).toUpperCase();

  return (
    <>
      <header className="h-16 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold tracking-tight text-white flex items-center gap-2">
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent font-extrabold">
              PulseAI
            </span>
            <span className="hidden sm:inline text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-normal border border-slate-700">
              Twitter NLP
            </span>
          </h1>

          {/* WebSocket & Live Stream Status */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs">
            <span
              className={`w-2 h-2 rounded-full ${
                isConnected ? "bg-emerald-400 animate-ping" : "bg-amber-400"
              }`}
            />
            <span className={isConnected ? "text-emerald-400 font-medium" : "text-amber-400"}>
              {isConnected ? "Live Stream Active" : "Connecting..."}
            </span>
          </div>

          {/* Category Channel Switcher */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-900/90 border border-slate-800 rounded-xl p-1 text-[11px]">
            {STREAM_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  if (onCategoryChange) onCategoryChange(cat.id);
                }}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1 ${
                  currentCategory === cat.id
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name.split(" ")[0]}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Twitter ID & Sentiment Pulse Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-sky-600 hover:bg-sky-500 text-white shadow-md shadow-sky-600/30 transition-all cursor-pointer active:scale-95"
            title="Search Twitter ID, account pulse, sports/gaming channels, or post tweets"
          >
            <Twitter className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search X ID & Pulse</span>
            <span className="sm:hidden">Search ID</span>
          </button>

          {/* Simulate Tweet Button */}
          <button
            onClick={handleTriggerSample}
            disabled={isPulsing}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-all cursor-pointer active:scale-95"
            title="Simulate an incoming live tweet through NLP classifier and WebSocket"
          >
            <Zap className={`w-3.5 h-3.5 text-indigo-400 ${isPulsing ? "animate-spin" : ""}`} />
            <span>Simulate Tweet</span>
          </button>

          {/* Connected User / Twitter Profile */}
          <div
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-800 cursor-pointer group"
            title="Click to view connected mail or Twitter account"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold shadow-inner group-hover:ring-2 group-hover:ring-sky-400 transition-all">
              {initials}
            </div>
            <div className="hidden xl:block text-left text-xs">
              <div className="font-medium text-slate-200 truncate max-w-[140px] group-hover:text-sky-300 transition-colors">
                {displayName}
              </div>
              <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Connected</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Modal for Ingesting Tweets & Connecting Email */}
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
