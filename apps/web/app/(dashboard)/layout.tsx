"use client";

import React, { createContext, useContext } from "react";
import { usePathname } from "next/navigation";
import { Header } from "@/components/ui/Header";
import { Sidebar } from "@/components/ui/Sidebar";
import { useLiveFeed } from "@/lib/websocket";
import { Tweet } from "@/lib/api-client";

interface LiveFeedContextType {
  isConnected: boolean;
  latestTweet: Tweet | null;
  liveStream: Tweet[];
  currentCategory: string;
  setCategory: (category: string) => void;
}

const LiveFeedContext = createContext<LiveFeedContextType>({
  isConnected: false,
  latestTweet: null,
  liveStream: [],
  currentCategory: "all",
  setCategory: () => {},
});

export const useLiveStreamContext = () => useContext(LiveFeedContext);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const {
    isConnected,
    streamMode,
    latestTweet,
    liveStream,
    currentCategory,
    setCategory
  } = useLiveFeed();

  const isTimelinePage = pathname === "/dashboard";

  return (
    <LiveFeedContext.Provider
      value={{
        isConnected,
        latestTweet,
        liveStream,
        currentCategory,
        setCategory
      }}
    >
      <div className="min-h-screen bg-[#000000] text-[#f7f9f9] flex flex-col font-sans selection:bg-[#1d9bf0]/30">
        {/* Mobile Top Navigation Header */}
        <Header
          isConnected={isConnected}
          streamMode={streamMode}
          currentCategory={currentCategory}
          onCategoryChange={setCategory}
        />

        {/* Twitter 3-Column Root Layout */}
        <div className="flex flex-1 justify-center max-w-[1320px] w-full mx-auto">
          {/* Left Column: Navigation Sidebar */}
          <Sidebar />

          {/* Main Content Area */}
          <main className={isTimelinePage ? "flex-1 min-w-0 flex min-h-screen" : "flex-1 min-w-0 p-5 sm:p-7 max-w-5xl mx-auto w-full min-h-screen"}>
            {children}
          </main>
        </div>
      </div>
    </LiveFeedContext.Provider>
  );
}
