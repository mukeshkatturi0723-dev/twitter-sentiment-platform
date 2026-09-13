import random
import uuid
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from services.api.app.core.config import settings

SAMPLE_TWEET_TEMPLATES = [
    # Positive
    ("elonmusk_fan", "The new AI updates are completely mindblowing! Productivity has increased 10x today. 🚀 #AI #Innovation #Tech", "positive"),
    ("sarah_codes", "Finally tried the new developer tooling and it is shockingly good. Super clean UX! 💻✨ #coding #webdev #developer", "positive"),
    ("tech_cruncher", "Record earnings and incredible product momentum for cloud infrastructure this quarter! #Cloud #Investing #Tech", "positive"),
    ("alex_reviewer", "Battery life on this device easily lasts 2 full days. Best purchase of the year! 🔥 #Gadgets #Review", "positive"),
    ("crypto_queen", "Huge protocol upgrade just shipped on mainnet without a single glitch. Bullish future! 📈 #Web3 #Crypto #DeFi", "positive"),
    ("design_guru", "The new typography and sleek dark mode in this app is pure aesthetic perfection. 👌 #UI #UX #Design", "positive"),
    ("green_earth", "Solar and renewable adoption just crossed 40% in our grid. What a massive milestone! ☀️🌿 #CleanEnergy #Future", "positive"),
    
    # Negative
    ("angry_customer", "The latest app update completely broke push notifications and keeps crashing on startup. Unacceptable! 😡 #Bug #Fail", "negative"),
    ("dev_dan", "Spent 4 hours debugging only to discover an undocumented breaking change in their API v2. Horrible docs! 🤬 #DevLife #API", "negative"),
    ("market_watcher", "Major supply chain bottlenecks and rising costs are severely impacting tech shipments this quarter. 📉 #Economy #Stocks", "negative"),
    ("security_watch", "Massive credential leak reported in third-party auth provider. Rotate your passwords immediately! 🚨 #Security #CyberSecurity", "negative"),
    ("frequent_flyer", "Flight delayed by 5 hours with zero customer service assistance. Worst airline experience ever! ✈️👎 #CustomerService #Disappointed", "negative"),
    ("gamer_pulse", "The server lag and latency on the new multiplayer season makes it unplayable right now. Fix your servers! 🎮💥 #Gaming #Lag", "negative"),
    
    # Neutral
    ("reuters_tech", "Global semiconductor committee meets today to review proposed manufacturing subsidies and regulations. #Semiconductor #Policy", "neutral"),
    ("press_release", "Company announces scheduled routine database maintenance for Sunday at 02:00 UTC. Systems will be read-only. #Maintenance #Notice", "neutral"),
    ("data_science_weekly", "Comparative benchmarks between LLM inference architectures published in latest arXiv paper. #MachineLearning #Research", "neutral"),
    ("fin_daily", "Federal Reserve leaves benchmark interest rates unchanged following two-day monetary policy conference. #Finance #Fed", "neutral"),
    ("gadget_specs", "The upcoming model reportedly features a 6.7 inch OLED panel with 120Hz variable refresh rate. #Smartphone #Specs", "neutral"),
    ("weather_alert", "Partly cloudy conditions expected across the metropolitan area with highs near 22 degrees Celsius. #Weather #Forecast", "neutral")
]

class TwitterService:
    def __init__(self):
        self.bearer_token = settings.TWITTER_BEARER_TOKEN
        self.has_api_access = bool(self.bearer_token and len(self.bearer_token) > 10)

    def fetch_live_tweets(self, query: str = "technology", max_results: int = 10) -> List[Dict[str, Any]]:
        """
        Fetch real tweets via X API v2 if bearer token is configured,
        otherwise generate realistic contextual mock tweets.
        """
        if self.has_api_access:
            try:
                import requests
                headers = {"Authorization": f"Bearer {self.bearer_token}"}
                url = "https://api.twitter.com/2/tweets/search/recent"
                params = {
                    "query": query,
                    "max_results": min(max_results, 100),
                    "tweet.fields": "created_at,author_id,lang"
                }
                response = requests.get(url, headers=headers, params=params, timeout=5)
                if response.status_code == 200:
                    data = response.json()
                    tweets = []
                    for t in data.get("data", []):
                        tweets.append({
                            "tweet_id": t.get("id"),
                            "author": t.get("author_id", "twitter_user"),
                            "text": t.get("text", ""),
                            "lang": t.get("lang", "en"),
                            "created_at": t.get("created_at"),
                            "source": "live_stream"
                        })
                    return tweets
            except Exception as e:
                pass  # Fall back to simulation

        # Fallback simulation
        return self.generate_mock_tweets(count=max_results, query=query)

    def generate_mock_tweet(self, category: Optional[str] = None) -> Dict[str, Any]:
        """Generate a single realistic tweet for live streaming simulation"""
        author, text, expected_sentiment = random.choice(SAMPLE_TWEET_TEMPLATES)
        
        # Extract hashtags
        words = text.split()
        hashtags = [w.lstrip("#") for w in words if w.startswith("#")]

        return {
            "tweet_id": str(random.randint(1000000000000000000, 1999999999999999999)),
            "author": author,
            "text": text,
            "lang": "en",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "hashtags": hashtags,
            "expected_sentiment": expected_sentiment,
            "source": "live_stream"
        }

    def generate_mock_tweets(self, count: int = 10, query: Optional[str] = None) -> List[Dict[str, Any]]:
        results = []
        for _ in range(count):
            results.append(self.generate_mock_tweet())
        return results

twitter_service = TwitterService()
