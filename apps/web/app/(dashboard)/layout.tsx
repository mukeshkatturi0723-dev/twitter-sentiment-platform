"use client";

import React, { createContext, useContext } from "react";
import { Header } from "@/components/ui/Header";
import { Sidebar } from "@/components/ui/Sidebar";
import { useLiveFeed } from "@/lib/websocket";
import { Tweet } from "@/lib/api-client";

interface LiveFeedContextType {
  isConnected: boolean;
  latestTweet: Tweet | null;
  liveStream: Tweet[];
}

const LiveFeedContext = createContext<LiveFeedContextType>({
  isConnected: false,
  latestTweet: null,
  liveStream: [],
});

export const useLiveStreamContext = () => useContext(LiveFeedContext);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isConnected, latestTweet, liveStream } = useLiveFeed();

  return (
    <LiveFeedContext.Provider value={{ isConnected, latestTweet, liveStream }}>
      <div className="min-h-screen flex flex-col bg-[#06090f] text-slate-100">
        <Header isConnected={isConnected} />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-6 lg:p-8 max-w-7xl mx-auto w-full">
            {children}
          </main>
        </div>
      </div>
    </LiveFeedContext.Provider>
  );
}
