import { useState, useEffect, useRef, useCallback } from "react";
import { Tweet } from "./api-client";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000/ws/live-feed";

export interface LiveFeedMessage {
  type: "NEW_TWEET" | "SUMMARY_UPDATE" | "CONNECTED" | "PONG";
  data?: Tweet;
  message?: string;
  timestamp: string;
}

export function useLiveFeed() {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [latestTweet, setLatestTweet] = useState<Tweet | null>(null);
  const [liveStream, setLiveStream] = useState<Tweet[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    try {
      const socket = new WebSocket(WS_URL);
      wsRef.current = socket;

      socket.onopen = () => {
        setIsConnected(true);
        console.log("[WebSocket] Connected to live stream");
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
        setIsConnected(false);
        console.log("[WebSocket] Disconnected. Reconnecting in 3s...");
        reconnectTimeoutRef.current = setTimeout(connect, 3000);
      };

      socket.onerror = (err) => {
        console.warn("[WebSocket] Error:", err);
        socket.close();
      };
    } catch (e) {
      console.warn("[WebSocket] Connection attempt failed:", e);
      reconnectTimeoutRef.current = setTimeout(connect, 5000);
    }
  }, []);

  useEffect(() => {
    connect();
    // Heartbeat ping every 25s
    const pingInterval = setInterval(() => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send("ping");
      }
    }, 25000);

    return () => {
      clearInterval(pingInterval);
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, [connect]);

  return { isConnected, latestTweet, liveStream };
}
