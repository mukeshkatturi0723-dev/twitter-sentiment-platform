import React, { useState } from "react";
import { Radio, Zap, RefreshCw, User, Bell } from "lucide-react";
import { api } from "@/lib/api-client";

interface HeaderProps {
  isConnected: boolean;
  onTweetIngested?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isConnected, onTweetIngested }) => {
  const [isPulsing, setIsPulsing] = useState(false);

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

  return (
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

        {/* WebSocket Live Status */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs">
          <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-emerald-400 animate-ping" : "bg-amber-400"}`} />
          <span className={isConnected ? "text-emerald-400 font-medium" : "text-amber-400"}>
            {isConnected ? "Live Stream Active" : "Connecting..."}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Pulse Mock Tweet Button */}
        <button
          onClick={handleTriggerSample}
          disabled={isPulsing}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition-all cursor-pointer active:scale-95"
          title="Simulate an incoming live tweet through NLP classifier and WebSocket"
        >
          <Zap className={`w-3.5 h-3.5 text-indigo-400 ${isPulsing ? "animate-spin" : ""}`} />
          <span>Simulate Tweet</span>
        </button>

        {/* Demo Analyst Profile */}
        <div className="flex items-center gap-2 pl-3 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold shadow-inner">
            JD
          </div>
          <div className="hidden md:block text-left text-xs">
            <div className="font-medium text-slate-200">analyst@sentiment.ai</div>
            <div className="text-[10px] text-slate-400 uppercase">Pro Analyst</div>
          </div>
        </div>
      </div>
    </header>
  );
};
