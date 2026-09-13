import re
import math
from typing import Dict, Any, List, Tuple
from services.api.app.core.config import settings

# Built-in high-precision sentiment lexicon for offline / instant fallback
POSITIVE_WORDS = {
    "good": 1.5, "great": 2.0, "awesome": 2.5, "amazing": 2.8, "excellent": 2.6,
    "love": 2.7, "loved": 2.5, "loving": 2.4, "best": 2.8, "fantastic": 2.7,
    "incredible": 2.7, "super": 1.8, "superb": 2.6, "wonderful": 2.6, "perfect": 2.9,
    "happy": 2.0, "glad": 1.5, "pleased": 1.6, "bullish": 2.2, "clean": 1.2,
    "mindblowing": 2.9, "impressive": 2.2, "fast": 1.3, "smooth": 1.4, "solid": 1.3,
    "gain": 1.5, "gains": 1.6, "win": 2.0, "winning": 2.1, "winner": 2.0,
    "innovative": 2.1, "growth": 1.6, "excited": 2.2, "exciting": 2.3, "delight": 2.4
}

NEGATIVE_WORDS = {
    "bad": -1.5, "terrible": -2.5, "awful": -2.6, "horrible": -2.8, "worst": -2.9,
    "hate": -2.7, "hated": -2.6, "hating": -2.5, "broken": -2.2, "break": -1.6,
    "crash": -2.4, "crashed": -2.5, "crashing": -2.5, "fail": -2.2, "failed": -2.3,
    "failure": -2.4, "poor": -1.6, "ugly": -1.8, "angry": -2.2, "frustrated": -2.4,
    "bug": -1.8, "bugs": -1.9, "slow": -1.4, "delay": -1.5, "delayed": -1.6,
    "leak": -2.2, "loss": -2.0, "losses": -2.1, "unacceptable": -2.7, "lag": -1.8,
    "disappointed": -2.4, "scam": -2.9, "waste": -2.3, "down": -1.2, "bearish": -1.8
}

EMOJI_SENTIMENT = {
    "🚀": 2.5, "🔥": 2.2, "✨": 1.8, "❤️": 2.5, "😍": 2.5, "😊": 1.8, "👍": 1.6, "🎉": 2.2, "👌": 1.7, "☀️": 1.5,
    "😡": -2.8, "🤬": -3.0, "👎": -2.0, "😢": -2.2, "😭": -2.0, "🚨": -1.8, "📉": -2.2, "💔": -2.5, "💥": -1.5, "🤮": -3.0
}

STOPWORDS = {
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
}

class NLPService:
    def __init__(self):
        self._vader_sia = None
        self._hf_pipeline = None
        self._init_vader()

    def _init_vader(self):
        try:
            from nltk.sentiment.vader import SentimentIntensityAnalyzer
            self._vader_sia = SentimentIntensityAnalyzer()
        except Exception:
            self._vader_sia = None

    def preprocess(self, text: str) -> Tuple[str, List[str], List[str]]:
        """
        Cleans URLs, mentions, extract hashtags and significant keywords.
        Returns: (cleaned_text, hashtags, keywords)
        """
        # Extract hashtags
        hashtags = [tag.lstrip("#").lower() for tag in re.findall(r'#\w+', text)]
        
        # Remove URLs
        cleaned = re.sub(r'https?://\S+|www\.\S+', '', text)
        
        # Remove mentions
        cleaned = re.sub(r'@\w+', '', cleaned)
        
        # Normalize whitespace
        cleaned = re.sub(r'\s+', ' ', cleaned).strip()

        # Tokenize and extract keywords
        tokens = re.findall(r'\b[a-zA-Z]{3,}\b', cleaned.lower())
        keywords = [t for t in tokens if t not in STOPWORDS]
        
        # Deduplicate while preserving order
        seen = set()
        dedup_keywords = []
        for kw in keywords:
            if kw not in seen:
                seen.add(kw)
                dedup_keywords.append(kw)

        return cleaned, hashtags, dedup_keywords[:8]

    def _score_with_vader(self, text: str) -> Dict[str, Any]:
        """VADER analysis with compound normalization"""
        if self._vader_sia is not None:
            try:
                scores = self._vader_sia.polarity_scores(text)
                compound = scores["compound"]
                pos = scores["pos"]
                neg = scores["neg"]
                neu = scores["neu"]

                if compound >= 0.05:
                    sentiment = "positive"
                    confidence = min(1.0, 0.5 + (compound * 0.5))
                elif compound <= -0.05:
                    sentiment = "negative"
                    confidence = min(1.0, 0.5 + (abs(compound) * 0.5))
                else:
                    sentiment = "neutral"
                    confidence = min(1.0, 0.5 + (neu * 0.4))

                return {
                    "sentiment": sentiment,
                    "confidence": round(confidence, 4),
                    "scores": {
                        "positive": round(pos, 4),
                        "negative": round(neg, 4),
                        "neutral": round(neu, 4)
                    },
                    "engine": "vader"
                }
            except Exception:
                pass
        
        return self._score_with_fallback_lexicon(text)

    def _score_with_fallback_lexicon(self, text: str) -> Dict[str, Any]:
        """Fast calibrated lexicon fallback"""
        cleaned_lower = text.lower()
        words = re.findall(r'\b\w+\b', cleaned_lower)

        pos_score = 0.0
        neg_score = 0.0

        for w in words:
            if w in POSITIVE_WORDS:
                pos_score += POSITIVE_WORDS[w]
            elif w in NEGATIVE_WORDS:
                neg_score += abs(NEGATIVE_WORDS[w])

        for char in text:
            if char in EMOJI_SENTIMENT:
                weight = EMOJI_SENTIMENT[char]
                if weight > 0:
                    pos_score += weight
                else:
                    neg_score += abs(weight)

        total_weight = pos_score + neg_score
        if total_weight > 0:
            pos_ratio = pos_score / total_weight
            neg_ratio = neg_score / total_weight
        else:
            pos_ratio = 0.0
            neg_ratio = 0.0

        net_diff = pos_score - neg_score

        if net_diff > 0.8:
            sentiment = "positive"
            confidence = min(0.98, 0.65 + (net_diff / (total_weight + 2)) * 0.35)
            neu_ratio = max(0.05, 1.0 - (pos_ratio * 0.85))
        elif net_diff < -0.8:
            sentiment = "negative"
            confidence = min(0.98, 0.65 + (abs(net_diff) / (total_weight + 2)) * 0.35)
            neu_ratio = max(0.05, 1.0 - (neg_ratio * 0.85))
        else:
            sentiment = "neutral"
            confidence = 0.72
            neu_ratio = 0.75
            pos_ratio = 0.12
            neg_ratio = 0.13

        # Normalize breakdown
        s_sum = pos_ratio + neg_ratio + neu_ratio
        if s_sum == 0:
            s_sum = 1.0

        return {
            "sentiment": sentiment,
            "confidence": round(confidence, 4),
            "scores": {
                "positive": round(pos_ratio / s_sum, 4),
                "negative": round(neg_ratio / s_sum, 4),
                "neutral": round(neu_ratio / s_sum, 4)
            },
            "engine": "lexicon_hybrid"
        }

    def classify(self, text: str) -> Dict[str, Any]:
        """
        Public classification pipeline:
        Runs preprocessing -> runs multi-tier model -> returns enriched classification.
        """
        cleaned_text, hashtags, keywords = self.preprocess(text)
        result = self._score_with_vader(text)

        return {
            "sentiment": result["sentiment"],
            "confidence": result["confidence"],
            "scores": result["scores"],
            "engine": result["engine"],
            "cleaned_text": cleaned_text,
            "keywords": keywords,
            "hashtags": hashtags
        }

nlp_service = NLPService()
