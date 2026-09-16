import { useState, useEffect, useRef, useCallback } from "react";
import { Tweet } from "./api-client";
import { MOCK_STREAM_POOL } from "./seed-data";
import { clientClassify } from "./client-nlp";
import { STREAM_CATEGORIES } from "./twitter-service";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "";

export interface LiveFeedMessage {
  type: "NEW_TWEET" | "SUMMARY_UPDATE" | "CONNECTED" | "PONG";
  data?: Tweet;
  message?: string;
  timestamp: string;
}

export function useLiveFeed(initialCategory: string = "all") {
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [streamMode, setStreamMode] = useState<"websocket" | "cloud_stream">("cloud_stream");
  const [currentCategory, setCurrentCategory] = useState<string>(initialCategory);
  const [latestTweet, setLatestTweet] = useState<Tweet | null>(null);
  const [liveStream, setLiveStream] = useState<Tweet[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const simulationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Trigger next simulated tweet based on currentCategory
  const triggerSimulatedTweet = useCallback(() => {
    let candidatePool: Array<{ author: string; text: string; hashtags?: string[] }> = [];

    if (currentCategory && currentCategory !== "all") {
      const catConfig = STREAM_CATEGORIES.find(c => c.id === currentCategory);
      if (catConfig && catConfig.tweets.length > 0) {
        candidatePool = catConfig.tweets;
      }
    }

    if (candidatePool.length === 0) {
      // Combined pool across all categories + mock stream
      candidatePool = [
        ...MOCK_STREAM_POOL,
        ...STREAM_CATEGORIES.flatMap(c => c.tweets)
      ];
    }

    const sample = candidatePool[Math.floor(Math.random() * candidatePool.length)];
    const nlp = clientClassify(sample.text);
    const mockTweet: Tweet = {
      id: "sim-" + Date.now() + "-" + Math.random().toString(36).substring(2, 5),
      tweet_id: "178" + Math.floor(Math.random() * 1000000000000000),
      author: sample.author,
      text: sample.text,
      lang: "en",
      created_at: new Date().toISOString(),
      hashtags: sample.hashtags || nlp.hashtags,
      sentiment: nlp.sentiment,
      confidence: nlp.confidence,
      source: "live_stream",
      ingested_at: new Date().toISOString()
    };

    setLatestTweet(mockTweet);
    setLiveStream((prev) => [mockTweet, ...prev.slice(0, 49)]);
  }, [currentCategory]);

  const startSimulation = useCallback(() => {
    setStreamMode("cloud_stream");
    setIsConnected(true);

    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current);
    }

    // Trigger initial tweet after 800ms
    setTimeout(triggerSimulatedTweet, 800);

    // Pulse every 10 seconds
    simulationIntervalRef.current = setInterval(() => {
      triggerSimulatedTweet();
    }, 10000);
  }, [triggerSimulatedTweet]);

  const connect = useCallback(() => {
    const isLocalhost = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
    const targetUrl = WS_URL || (isLocalhost ? "ws://localhost:8000/ws/live-feed" : "");

    if (!targetUrl || (typeof window !== "undefined" && window.location.protocol === "https:" && targetUrl.startsWith("ws://"))) {
      startSimulation();
      return;
    }

    try {
      const socket = new WebSocket(targetUrl);
      wsRef.current = socket;

      socket.onopen = () => {
        setIsConnected(true);
        setStreamMode("websocket");
        console.log("[WebSocket] Connected to live gateway stream");
      };

      socket.onmessage = (event) => {
        try {
          const msg: LiveFeedMessage = JSON.parse(event.data);
          if (msg.type === "NEW_TWEET" && msg.data) {
            setLatestTweet(msg.data);
            setLiveStream((prev) => [msg.data!, ...prev.slice(0, 49)]);
          }
        } catch (e) {
          console.error("[WebSocket] Parse error:", e);
        }
      };

      socket.onclose = () => {
        startSimulation();
      };

      socket.onerror = () => {
        if (socket.readyState === WebSocket.OPEN) socket.close();
        startSimulation();
      };
    } catch (e) {
      startSimulation();
    }
  }, [startSimulation]);

  useEffect(() => {
    connect();

    const handleCustomTweet = (e: Event) => {
      const customEvent = e as CustomEvent<Tweet>;
      if (customEvent.detail) {
        setLatestTweet(customEvent.detail);
        setLiveStream((prev) => [customEvent.detail, ...prev.slice(0, 49)]);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("pulseai-new-tweet", handleCustomTweet);
    }

    return () => {
      if (wsRef.current) wsRef.current.close();
      if (simulationIntervalRef.current) clearInterval(simulationIntervalRef.current);
      if (typeof window !== "undefined") {
        window.removeEventListener("pulseai-new-tweet", handleCustomTweet);
      }
    };
  }, [connect]);

  // Restart simulator with updated category when currentCategory changes
  useEffect(() => {
    if (streamMode === "cloud_stream") {
      startSimulation();
    }
  }, [currentCategory, startSimulation, streamMode]);

  return {
    isConnected,
    streamMode,
    latestTweet,
    liveStream,
    currentCategory,
    setCategory: setCurrentCategory
  };
}
