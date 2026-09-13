const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface Tweet {
  id: string;
  tweet_id: string;
  author: string;
  text: string;
  lang: string;
  created_at: string;
  hashtags: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  source: string;
  ingested_at: string;
}

export interface PaginatedTweets {
  items: Tweet[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface AnalyticsSummary {
  total_tweets: number;
  counts: {
    positive: number;
    negative: number;
    neutral: number;
    total: number;
  };
  percentages: {
    positive: number;
    negative: number;
    neutral: number;
  };
  average_confidence: number;
  timeframe: string;
  change_vs_last_week: {
    positive_delta: number;
    negative_delta: number;
    neutral_delta: number;
    total_delta: number;
  };
}

export interface TrendPoint {
  timestamp: string;
  date: string;
  positive: number;
  negative: number;
  neutral: number;
  total: number;
  net_sentiment_score: number;
}

export interface KeywordItem {
  keyword: string;
  count: number;
  sentiment_dominant: 'positive' | 'negative' | 'neutral';
  positive_ratio: number;
}

export interface BrandComparisonItem {
  brand: string;
  total_mentions: number;
  positive_percentage: number;
  negative_percentage: number;
  neutral_percentage: number;
  net_sentiment_score: number;
}

export interface ClassifyResult {
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  scores: {
    positive: number;
    negative: number;
    neutral: number;
  };
  engine: string;
  cleaned_text: string;
  keywords: string[];
  hashtags: string[];
}

class ApiClient {
  private token: string | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("sentiment_auth_token");
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("sentiment_auth_token", token);
      } else {
        localStorage.removeItem("sentiment_auth_token");
      }
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE}${endpoint}`;
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    if (this.token && !headers["Authorization"]) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    if (!(options.body instanceof FormData) && !headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }

    try {
      const response = await fetch(url, { ...options, headers });
      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`API Error [${response.status}]: ${errorBody}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Request error on ${endpoint}:`, error);
      throw error;
    }
  }

  // Auth
  async login(email: string, password: string) {
    const res = await this.request<any>("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (res?.access_token) {
      this.setToken(res.access_token);
    }
    return res;
  }

  async signup(email: string, password: string) {
    const res = await this.request<any>("/api/v1/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (res?.access_token) {
      this.setToken(res.access_token);
    }
    return res;
  }

  // Tweets
  async getTweets(params: {
    query?: string;
    sentiment?: string;
    from?: string;
    to?: string;
    page?: number;
    limit?: number;
    sort_by?: string;
    sort_order?: string;
  } = {}): Promise<PaginatedTweets> {
    const searchParams = new URLSearchParams();
    if (params.query) searchParams.append("query", params.query);
    if (params.sentiment && params.sentiment !== "all") searchParams.append("sentiment", params.sentiment);
    if (params.from) searchParams.append("from", params.from);
    if (params.to) searchParams.append("to", params.to);
    if (params.page) searchParams.append("page", params.page.toString());
    if (params.limit) searchParams.append("limit", params.limit.toString());
    if (params.sort_by) searchParams.append("sort_by", params.sort_by);
    if (params.sort_order) searchParams.append("sort_order", params.sort_order);

    return this.request<PaginatedTweets>(`/api/v1/tweets?${searchParams.toString()}`);
  }

  async classifyText(text: string): Promise<ClassifyResult> {
    return this.request<ClassifyResult>("/api/v1/tweets/classify", {
      method: "POST",
      body: JSON.stringify({ text }),
    });
  }

  async triggerLiveSample(): Promise<Tweet> {
    return this.request<Tweet>("/api/v1/tweets/live-sample", {
      method: "POST",
    });
  }

  // Analytics
  async getSummary(): Promise<AnalyticsSummary> {
    return this.request<AnalyticsSummary>("/api/v1/analytics/summary");
  }

  async getTrend(keyword?: string, days: number = 7): Promise<TrendPoint[]> {
    const q = new URLSearchParams({ days: days.toString() });
    if (keyword) q.append("keyword", keyword);
    return this.request<TrendPoint[]>(`/api/v1/analytics/trend?${q.toString()}`);
  }

  async getKeywords(limit: number = 15): Promise<KeywordItem[]> {
    return this.request<KeywordItem[]>(`/api/v1/analytics/keywords?limit=${limit}`);
  }

  async getBrandComparison(brands: string = "Apple,Google,Microsoft,OpenAI,Tesla"): Promise<{ brands: BrandComparisonItem[] }> {
    return this.request<{ brands: BrandComparisonItem[] }>(`/api/v1/analytics/compare?brands=${encodeURIComponent(brands)}`);
  }

  // Upload
  async uploadCsv(file: File): Promise<any> {
    const formData = new FormData();
    formData.append("file", file);
    return this.request<any>("/api/v1/upload", {
      method: "POST",
      body: formData,
    });
  }
}

export const api = new ApiClient();
