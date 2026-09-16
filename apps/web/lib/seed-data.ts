import { Tweet } from "./api-client";

export const INITIAL_SEEDED_TWEETS: Tweet[] = [
  {
    id: "mock-1",
    tweet_id: "1780000000000000001",
    author: "tech_insider",
    text: "OpenAI just released GPT-5 reasoning previews and the benchmark latency is insanely fast! 🚀✨ #AI #OpenAI",
    lang: "en",
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    hashtags: ["ai", "openai"],
    sentiment: "positive",
    confidence: 0.942,
    source: "live_stream",
    ingested_at: new Date().toISOString(),
  },
  {
    id: "mock-2",
    tweet_id: "1780000000000000002",
    author: "hardware_tester",
    text: "The latest smartphone thermal throttling is terrible under load. Battery drain bug makes it unusable 😡👎 #Fail",
    lang: "en",
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    hashtags: ["fail"],
    sentiment: "negative",
    confidence: 0.915,
    source: "live_stream",
    ingested_at: new Date().toISOString(),
  },
  {
    id: "mock-3",
    tweet_id: "1780000000000000003",
    author: "silicon_daily",
    text: "Nvidia announces next-generation Blackwell B200 accelerators shipping to cloud hyperscalers next quarter. #Nvidia",
    lang: "en",
    created_at: new Date(Date.now() - 1000 * 60 * 80).toISOString(),
    hashtags: ["nvidia"],
    sentiment: "neutral",
    confidence: 0.880,
    source: "live_stream",
    ingested_at: new Date().toISOString(),
  },
  {
    id: "mock-4",
    tweet_id: "1780000000000000004",
    author: "tesla_investor",
    text: "Tesla FSD v13 zero-intervention drive across San Francisco was pure magic! Smooth turns and instant decisions. 🔥🏎️ #Tesla",
    lang: "en",
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    hashtags: ["tesla"],
    sentiment: "positive",
    confidence: 0.960,
    source: "live_stream",
    ingested_at: new Date().toISOString(),
  },
  {
    id: "mock-5",
    tweet_id: "1780000000000000005",
    author: "dev_rants",
    text: "Cloud service down again for the second time this week. Production database crash during peak traffic! 💔📉 #Outage",
    lang: "en",
    created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    hashtags: ["outage"],
    sentiment: "negative",
    confidence: 0.930,
    source: "live_stream",
    ingested_at: new Date().toISOString(),
  },
  {
    id: "mock-6",
    tweet_id: "1780000000000000006",
    author: "apple_enthusiast",
    text: "Apple Vision Pro developer framework update has introduced great ergonomics and hand-tracking precision. #Apple",
    lang: "en",
    created_at: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    hashtags: ["apple"],
    sentiment: "positive",
    confidence: 0.890,
    source: "live_stream",
    ingested_at: new Date().toISOString(),
  },
  {
    id: "mock-7",
    tweet_id: "1780000000000000007",
    author: "market_wire",
    text: "Microsoft reports 18% growth in cloud intelligence and enterprise productivity seat license renewals. #Microsoft",
    lang: "en",
    created_at: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    hashtags: ["microsoft"],
    sentiment: "neutral",
    confidence: 0.840,
    source: "live_stream",
    ingested_at: new Date().toISOString(),
  },
  {
    id: "mock-8",
    tweet_id: "1780000000000000008",
    author: "ai_researcher",
    text: "Google DeepMind's new multimodal robotics model achieves incredible state-of-the-art results in physical manipulation! 🚀 #Google",
    lang: "en",
    created_at: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    hashtags: ["google"],
    sentiment: "positive",
    confidence: 0.945,
    source: "live_stream",
    ingested_at: new Date().toISOString(),
  }
];

export const MOCK_STREAM_POOL = [
  {
    author: "elon_watcher",
    text: "Superheavy booster catch was unbelievable to watch live on stream! Aerospace history made. 🚀🔥 #SpaceX #Innovation",
    hashtags: ["spacex", "innovation"]
  },
  {
    author: "cloud_admin",
    text: "Huge memory leak bug in modern kubernetes ingress driver. Clusters running out of socket descriptors 😡 #Bug #DevOps",
    hashtags: ["bug", "devops"]
  },
  {
    author: "crypto_bulletin",
    text: "Federal Reserve maintains interest rates at present benchmark range following monetary policy committee vote.",
    hashtags: ["finance", "fed"]
  },
  {
    author: "ai_founder",
    text: "Our new voice agent is live! Loving how smooth and natural speech synthesis latency is now. ❤️✨ #AI #ProductLaunch",
    hashtags: ["ai", "productlaunch"]
  },
  {
    author: "gamer_feed",
    text: "Latest patch broke high refresh rate support and graphics stuttering is horrible. Totally unacceptable! 👎📉 #Gaming",
    hashtags: ["gaming"]
  },
  {
    author: "green_energy",
    text: "Global solar installation capacity exceeded expectations by 24% according to annual energy transition data.",
    hashtags: ["energy", "solar"]
  },
  {
    author: "tech_reviewer",
    text: "The titanium finish and high battery endurance make this the best flagship phone of 2026! Loving every moment. 🚀❤️ #Tech",
    hashtags: ["tech"]
  }
];
