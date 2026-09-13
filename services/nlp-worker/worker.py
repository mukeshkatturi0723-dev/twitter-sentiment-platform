import os
import logging
from typing import List, Dict, Any

try:
    from celery import Celery
except ImportError:
    Celery = None

from preprocessing import preprocess_pipeline
from model.vader_scorer import VaderScorer
from model.transformer_loader import TransformerClassifier

logger = logging.getLogger(__name__)

CELERY_BROKER_URL = os.getenv("CELERY_BROKER_URL", "redis://localhost:6379/0")
CELERY_RESULT_BACKEND = os.getenv("CELERY_RESULT_BACKEND", "redis://localhost:6379/0")

if Celery:
    app = Celery("nlp_worker", broker=CELERY_BROKER_URL, backend=CELERY_RESULT_BACKEND)
    app.conf.update(
        task_serializer="json",
        result_serializer="json",
        accept_content=["json"],
        timezone="UTC",
        enable_utc=True,
    )
else:
    app = None

# Initialize scorers
vader = VaderScorer()
transformer = TransformerClassifier()

def process_single_tweet(text: str) -> Dict[str, Any]:
    cleaned_text, hashtags, keywords = preprocess_pipeline(text)
    
    # Try transformer first if confidence high
    t_pred = transformer.predict(cleaned_text)
    if t_pred and t_pred["confidence"] >= 0.70:
        sentiment = t_pred["sentiment"]
        confidence = t_pred["confidence"]
        engine = "transformer_roberta"
    else:
        v_res = vader.score(cleaned_text)
        sentiment = v_res["sentiment"]
        confidence = v_res["confidence"]
        engine = "vader_baseline"

    return {
        "text": text,
        "cleaned_text": cleaned_text,
        "hashtags": hashtags,
        "keywords": keywords,
        "sentiment": sentiment,
        "confidence": confidence,
        "engine": engine
    }

if app:
    @app.task(name="tasks.classify_tweet")
    def classify_tweet_task(text: str) -> Dict[str, Any]:
        return process_single_tweet(text)

    @app.task(name="tasks.batch_classify")
    def batch_classify_task(tweets: List[str]) -> List[Dict[str, Any]]:
        return [process_single_tweet(t) for t in tweets]

if __name__ == "__main__":
    test_res = process_single_tweet("Antigravity and AI are the future of software development! 🚀")
    print("Worker test classification:", test_res)
