// Client-side high-precision sentiment lexicon and NLP engine
// Ensures 100% functionality on standalone Vercel / serverless deployments

export interface ClientNlpResult {
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

const POSITIVE_WORDS: Record<string, number> = {
  good: 1.5, great: 2.0, awesome: 2.5, amazing: 2.8, excellent: 2.6,
  love: 2.7, loved: 2.5, loving: 2.4, best: 2.8, fantastic: 2.7,
  incredible: 2.7, super: 1.8, superb: 2.6, wonderful: 2.6, perfect: 2.9,
  happy: 2.0, glad: 1.5, pleased: 1.6, bullish: 2.2, clean: 1.2,
  mindblowing: 2.9, impressive: 2.2, fast: 1.3, smooth: 1.4, solid: 1.3,
  gain: 1.5, gains: 1.6, win: 2.0, winning: 2.1, winner: 2.0,
  innovative: 2.1, growth: 1.6, excited: 2.2, exciting: 2.3, delight: 2.4,
  breakthrough: 2.5, recommend: 2.0, recommended: 2.0, beautiful: 2.2,
  smoothly: 1.6, top: 1.4, superior: 2.1, thrilled: 2.5, legendary: 2.5
};

const NEGATIVE_WORDS: Record<string, number> = {
  bad: -1.5, terrible: -2.5, awful: -2.6, horrible: -2.8, worst: -2.9,
  hate: -2.7, hated: -2.6, hating: -2.5, broken: -2.2, break: -1.6,
  crash: -2.4, crashed: -2.5, crashing: -2.5, fail: -2.2, failed: -2.3,
  failure: -2.4, poor: -1.6, ugly: -1.8, angry: -2.2, frustrated: -2.4,
  bug: -1.8, bugs: -1.9, slow: -1.4, delay: -1.5, delayed: -1.6,
  leak: -2.2, loss: -2.0, losses: -2.1, unacceptable: -2.7, lag: -1.8,
  disappointed: -2.4, scam: -2.9, waste: -2.3, down: -1.2, bearish: -1.8,
  glitch: -1.8, unusable: -2.6, refund: -2.0, annoyed: -2.0, terrible_support: -2.7
};

const EMOJI_WEIGHTS: Record<string, number> = {
  "🚀": 2.5, "🔥": 2.2, "✨": 1.8, "❤️": 2.5, "😍": 2.5, "😊": 1.8, "👍": 1.6, "🎉": 2.2, "👌": 1.7, "☀️": 1.5,
  "😡": -2.8, "🤬": -3.0, "👎": -2.0, "😢": -2.2, "😭": -2.0, "🚨": -1.8, "📉": -2.2, "💔": -2.5, "💥": -1.5, "🤮": -3.0
};

const STOPWORDS = new Set([
  "a", "about", "above", "after", "again", "against", "all", "am", "an", "and",
  "any", "are", "aren't", "as", "at", "be", "because", "been", "before", "being",
  "below", "between", "both", "but", "by", "can't", "cannot", "could", "couldn't",
  "did", "didn't", "do", "does", "doesn't", "doing", "don't", "down", "during",
  "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't",
  "have", "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here",
  "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i",
  "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't", "it", "it's",
  "its", "itself", "let's", "me", "more", "most", "mustn't", "my", "myself",
  "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought",
  "our", "ours", "ourselves", "out", "over", "own", "same", "shan't", "she",
  "she'd", "she'll", "she's", "should", "shouldn't", "so", "some", "such",
  "than", "that", "that's", "the", "their", "theirs", "them", "themselves",
  "then", "there", "there's", "these", "they", "they'd", "they'll", "they're",
  "they've", "this", "those", "through", "to", "too", "under", "until", "up",
  "very", "was", "wasn't", "we", "we'd", "we'll", "we're", "we've", "were",
  "weren't", "what", "what's", "when", "when's", "where", "where's", "which",
  "while", "who", "who's", "whom", "why", "why's", "with", "won't", "would",
  "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your", "yours",
  "yourself", "yourselves"
]);

export function clientClassify(text: string): ClientNlpResult {
  // 1. Extract hashtags
  const hashtagMatches = text.match(/#\w+/g) || [];
  const hashtags = hashtagMatches.map(tag => tag.slice(1).toLowerCase());

  // 2. Clean URLs & mentions
  let cleaned = text.replace(/https?:\/\/\S+|www\.\S+/gi, "");
  cleaned = cleaned.replace(/@\w+/gi, "");
  cleaned = cleaned.replace(/\s+/g, " ").trim();

  // 3. Extract keywords
  const tokens = cleaned.toLowerCase().match(/\b[a-zA-Z]{3,}\b/g) || [];
  const keywords = Array.from(new Set(tokens.filter(t => !STOPWORDS.has(t)))).slice(0, 8);

  // 4. Score sentiment
  let posScore = 0.0;
  let negScore = 0.0;

  tokens.forEach(token => {
    if (POSITIVE_WORDS[token]) posScore += POSITIVE_WORDS[token];
    if (NEGATIVE_WORDS[token]) negScore += Math.abs(NEGATIVE_WORDS[token]);
  });

  for (const char of text) {
    if (EMOJI_WEIGHTS[char]) {
      const weight = EMOJI_WEIGHTS[char];
      if (weight > 0) posScore += weight;
      else negScore += Math.abs(weight);
    }
  }

  const totalWeight = posScore + negScore;
  const netDiff = posScore - negScore;

  let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
  let confidence = 0.72;
  let posRatio = 0.15;
  let negRatio = 0.15;
  let neuRatio = 0.70;

  if (netDiff > 0.6) {
    sentiment = 'positive';
    confidence = Math.min(0.98, 0.68 + (netDiff / (totalWeight + 2)) * 0.32);
    posRatio = Math.min(0.92, 0.55 + (posScore / (totalWeight + 1)) * 0.35);
    negRatio = Math.max(0.02, 0.1 - (netDiff * 0.02));
    neuRatio = Math.max(0.06, 1.0 - (posRatio + negRatio));
  } else if (netDiff < -0.6) {
    sentiment = 'negative';
    confidence = Math.min(0.98, 0.68 + (Math.abs(netDiff) / (totalWeight + 2)) * 0.32);
    negRatio = Math.min(0.92, 0.55 + (negScore / (totalWeight + 1)) * 0.35);
    posRatio = Math.max(0.02, 0.1 - (Math.abs(netDiff) * 0.02));
    neuRatio = Math.max(0.06, 1.0 - (posRatio + negRatio));
  } else {
    sentiment = 'neutral';
    confidence = 0.75;
    neuRatio = 0.74;
    posRatio = 0.13;
    negRatio = 0.13;
  }

  const sum = posRatio + negRatio + neuRatio;

  return {
    sentiment,
    confidence: Number(confidence.toFixed(3)),
    scores: {
      positive: Number((posRatio / sum).toFixed(3)),
      negative: Number((negRatio / sum).toFixed(3)),
      neutral: Number((neuRatio / sum).toFixed(3))
    },
    engine: "hybrid_lexicon",
    cleaned_text: cleaned,
    keywords,
    hashtags
  };
}
