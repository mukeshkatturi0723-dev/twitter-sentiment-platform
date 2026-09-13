from typing import Dict, Any

class VaderScorer:
    def __init__(self):
        try:
            from nltk.sentiment.vader import SentimentIntensityAnalyzer
            self.sia = SentimentIntensityAnalyzer()
        except Exception:
            self.sia = None

    def score(self, text: str) -> Dict[str, Any]:
        if self.sia:
            scores = self.sia.polarity_scores(text)
            compound = scores["compound"]
            if compound >= 0.05:
                label = "positive"
                conf = min(1.0, 0.5 + compound * 0.5)
            elif compound <= -0.05:
                label = "negative"
                conf = min(1.0, 0.5 + abs(compound) * 0.5)
            else:
                label = "neutral"
                conf = min(1.0, 0.5 + scores["neu"] * 0.4)
            return {
                "sentiment": label,
                "confidence": round(conf, 4),
                "scores": scores
            }
        
        # Fallback if VADER unavailable
        return {
            "sentiment": "neutral",
            "confidence": 0.65,
            "scores": {"compound": 0.0, "pos": 0.2, "neg": 0.2, "neu": 0.6}
        }
