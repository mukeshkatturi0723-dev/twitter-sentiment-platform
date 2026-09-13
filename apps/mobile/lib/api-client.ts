import { Tweet, PaginatedTweetsResponse, AnalyticsSummary, ClassificationResult } from "@shared/index";

export const API_BASE = "http://10.0.2.2:8000"; // Default Android emulator / LAN bridge; fallback to localhost

export async function fetchSummary(): Promise<any> {
  try {
    const res = await fetch("http://localhost:8000/api/v1/analytics/summary");
    if (!res.ok) throw new Error("Network response was not ok");
    return await res.json();
  } catch {
    // Return sample offline summary
    return {
      total_tweets: 32,
      percentages: { positive: 40.6, negative: 31.3, neutral: 28.1 },
      counts: { positive: 13, negative: 10, neutral: 9, total: 32 },
      average_confidence: 0.86
    };
  }
}

export async function fetchTweets(sentiment?: string): Promise<any[]> {
  try {
    const q = sentiment && sentiment !== "all" ? `?sentiment=${sentiment}` : "";
    const res = await fetch(`http://localhost:8000/api/v1/tweets${q}`);
    if (!res.ok) throw new Error("Network response was not ok");
    const data = await res.json();
    return data.items || [];
  } catch {
    return [
      {
        id: "1",
        author: "sam_altman_fan",
        text: "OpenAI just dropped the new reasoning architecture. It's shockingly fast and accurate! 🚀",
        sentiment: "positive",
        confidence: 0.94,
        created_at: new Date().toISOString()
      },
      {
        id: "2",
        author: "angry_customer_88",
        text: "Apple customer support made me wait 90 minutes just to tell me to reboot. Terrible service! 😡",
        sentiment: "negative",
        confidence: 0.91,
        created_at: new Date().toISOString()
      },
      {
        id: "3",
        author: "tech_roundup",
        text: "Tesla files patent for novel steer-by-wire dual actuator redundancy system.",
        sentiment: "neutral",
        confidence: 0.82,
        created_at: new Date().toISOString()
      }
    ];
  }
}

export async function classifyTextMobile(text: string): Promise<any> {
  try {
    const res = await fetch("http://localhost:8000/api/v1/tweets/classify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });
    return await res.json();
  } catch {
    return {
      sentiment: "positive",
      confidence: 0.88,
      scores: { positive: 0.88, negative: 0.05, neutral: 0.07 },
      engine: "hybrid_offline"
    };
  }
}
