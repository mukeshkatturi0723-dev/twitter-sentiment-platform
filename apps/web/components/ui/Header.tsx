"use client";

import React, { useState, useEffect } from "react";
import { Radio, Zap, Plus, User, LogOut, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api-client";
import { AddTweetModal } from "@/components/feed/AddTweetModal";

interface HeaderProps {
  isConnected: boolean;
  streamMode?: "websocket" | "cloud_stream";
  onTweetIngested?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isConnected,
  streamMode = "cloud_stream",
  onTweetIngested
}) => {
  const [isPulsing, setIsPulsing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("analyst@sentiment.ai");

  useEffect(() => {
    setUserEmail(api.getCurrentUserEmail());

    const handleStorageChange = () => {
      setUserEmail(api.getCurrentUserEmail());
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

  // Get user initials
  const initials = userEmail
    ? userEmail.split("@")[0].substring(0, 2).toUpperCase()
    : "AI";

  return (
    <>
      <header className="h-16 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold tracking-tight text-white flex items-center gap-2">
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent font-extrabold">
              PulseAI
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-normal border border-slate-700">
              Twitter NLP
            </span>
          </h1>

          {/* WebSocket & Live Stream Status */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs">
            <span
              className={`w-2 h-2 rounded-full ${
                isConnected ? "bg-emerald-400 animate-ping" : "bg-amber-400"
              }`}
            />
            <span className={isConnected ? "text-emerald-400 font-medium" : "text-amber-400"}>
              {isConnected ? "Live Stream Active" : "Connecting..."}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Add / Connect Tweets Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all cursor-pointer active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add / Connect Tweets</span>
            <span className="sm:hidden">Add</span>
          </button>

          {/* Pulse Simulated Tweet Button */}
          <button
            onClick={handleTriggerSample}
            disabled={isPulsing}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-all cursor-pointer active:scale-95"
            title="Simulate an incoming live tweet through NLP classifier and WebSocket"
          >
            <Zap className={`w-3.5 h-3.5 text-indigo-400 ${isPulsing ? "animate-spin" : ""}`} />
            <span>Simulate Tweet</span>
          </button>

          {/* Connected User Profile */}
          <div
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 pl-3 border-l border-slate-800 cursor-pointer group"
            title="Click to manage connected mail or twitter account"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold shadow-inner group-hover:ring-2 group-hover:ring-indigo-500 transition-all">
              {initials}
            </div>
            <div className="hidden lg:block text-left text-xs">
              <div className="font-medium text-slate-200 truncate max-w-[140px] group-hover:text-indigo-400 transition-colors">
                {userEmail}
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
        }}
        onSuccess={() => {
          if (onTweetIngested) onTweetIngested();
          setUserEmail(api.getCurrentUserEmail());
        }}
      />
    </>
  );
};
