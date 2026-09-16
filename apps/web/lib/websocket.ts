import { useState, useEffect, useRef, useCallback } from "react";
import { Tweet, api } from "./api-client";
import { MOCK_STREAM_POOL } from "./seed-data";
import { clientClassify } from "./client-nlp";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "";

export interface LiveFeedMessage {
  type: "NEW_TWEET" | "SUMMARY_UPDATE" | "CONNECTED" | "PONG";
  data?: Tweet;
  message?: string;
  timestamp: string;
}

export function useLiveFeed() {
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [streamMode, setStreamMode] = useState<"websocket" | "cloud_stream">("cloud_stream");
  const [latestTweet, setLatestTweet] = useState<Tweet | null>(null);
  const [liveStream, setLiveStream] = useState<Tweet[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const simulationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fallback simulator for cloud / Vercel
  const triggerSimulatedTweet = useCallback(() => {
    const sample = MOCK_STREAM_POOL[Math.floor(Math.random() * MOCK_STREAM_POOL.length)];
    const nlp = clientClassify(sample.text);
    const mockTweet: Tweet = {
      id: "sim-" + Date.now(),
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
  }, []);

  const startSimulation = useCallback(() => {
    setStreamMode("cloud_stream");
    setIsConnected(true);

    if (!simulationIntervalRef.current) {
      // Trigger initial tweet after 1.5s
      setTimeout(triggerSimulatedTweet, 1500);

      // Pulse every 11 seconds
      simulationIntervalRef.current = setInterval(() => {
        triggerSimulatedTweet();
      }, 11000);
    }
  }, [triggerSimulatedTweet]);

  const connect = useCallback(() => {
    // Only attempt real WebSocket if URL is explicitly provided or if on localhost
    const isLocalhost = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
    const targetUrl = WS_URL || (isLocalhost ? "ws://localhost:8000/ws/live-feed" : "");

    if (!targetUrl || (typeof window !== "undefined" && window.location.protocol === "https:" && targetUrl.startsWith("ws://"))) {
      // Insecure WS on HTTPS -> automatically use Cloud Simulation
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
          console.error("[WebSocket] Message parse error:", e);
        }
      };

      socket.onclose = () => {
        console.warn("[WebSocket] Gateway closed. Falling back to Cloud Stream.");
        startSimulation();
      };

      socket.onerror = (err) => {
        console.warn("[WebSocket] Error. Using Cloud Stream mode:", err);
        socket.close();
        startSimulation();
      };
    } catch (e) {
      startSimulation();
    }
  }, [startSimulation]);

  useEffect(() => {
    connect();

    // Listen for custom tweet ingestions triggered locally
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

  return { isConnected, streamMode, latestTweet, liveStream };
}
