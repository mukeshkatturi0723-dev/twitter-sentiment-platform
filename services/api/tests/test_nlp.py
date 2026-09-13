import pytest
from services.api.app.services.nlp_service import nlp_service

def test_nlp_preprocessing():
    raw_tweet = "Loving the new update! Check it out at https://antigravity.ai @elonmusk #AI #Tech 🚀"
    cleaned, hashtags, keywords = nlp_service.preprocess(raw_tweet)
    
    assert "https://" not in cleaned
    assert "@elonmusk" not in cleaned
    assert "ai" in hashtags
    assert "tech" in hashtags
    assert "loving" in keywords or "update" in keywords

def test_nlp_positive_sentiment():
    text = "The new software is absolutely amazing and wonderfully fast! Love it so much! 🚀✨"
    result = nlp_service.classify(text)
    assert result["sentiment"] == "positive"
    assert result["confidence"] > 0.5
    assert result["scores"]["positive"] > result["scores"]["negative"]

def test_nlp_negative_sentiment():
    text = "This is the worst experience ever. App keeps crashing and broken customer service! 😡👎"
    result = nlp_service.classify(text)
    assert result["sentiment"] == "negative"
    assert result["confidence"] > 0.5
    assert result["scores"]["negative"] > result["scores"]["positive"]

def test_nlp_neutral_sentiment():
    text = "The quarterly press release will be published tomorrow at 10:00 AM UTC."
    result = nlp_service.classify(text)
    assert result["sentiment"] == "neutral"
    assert result["confidence"] > 0.4
