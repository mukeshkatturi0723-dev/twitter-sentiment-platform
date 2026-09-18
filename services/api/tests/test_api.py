import pytest
from fastapi.testclient import TestClient
from services.api.app.main import app

client = TestClient(app)

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_classify_endpoint():
    response = client.post(
        "/api/v1/tweets/classify",
        json={"text": "Incredible performance boost with this update! Best tool ever. 🚀"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["sentiment"] == "positive"
    assert "confidence" in data
    assert "scores" in data

def test_get_tweets():
    response = client.get("/api/v1/tweets?page=1&limit=5")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data
    assert len(data["items"]) <= 5

def test_analytics_summary():
    response = client.get("/api/v1/analytics/summary")
    assert response.status_code == 200
    data = response.json()
    assert "total_tweets" in data
    assert "percentages" in data
    assert "positive" in data["percentages"]
    assert "negative" in data["percentages"]
    assert "neutral" in data["percentages"]

def test_analytics_trend():
    response = client.get("/api/v1/analytics/trend?days=7")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 7

def test_brand_comparison():
    response = client.get("/api/v1/analytics/compare?brands=Apple,Google,Tesla")
    assert response.status_code == 200
    data = response.json()
    assert "brands" in data
    assert len(data["brands"]) == 3

def test_auth_login():
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "analyst@sentiment.ai", "password": "password123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == "analyst@sentiment.ai"

def test_api_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["model"] == "ready"

def test_direct_analyze():
    response = client.post(
        "/api/analyze",
        json={"text": "Outstanding speed and gorgeous UI! Highly recommend. 🔥"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["sentiment"] == "positive"
    assert data["confidence"] > 0.6
    assert "scores" in data

def test_direct_batch_analyze():
    response = client.post(
        "/api/batch-analyze",
        json={"texts": [
            "Superb product, loving it!",
            "Horrible customer service, very disappointed.",
            "Meeting rescheduled to 4 PM."
        ]}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 3
    assert "summary" in data
    assert data["summary"]["positive"] >= 1
    assert data["summary"]["negative"] >= 1

def test_model_metadata():
    response = client.get("/api/model")
    assert response.status_code == 200
    data = response.json()
    assert "name" in data
    assert "evaluationMetrics" in data
    assert data["evaluationMetrics"]["accuracy"] > 80.0
    assert len(data["comparisonModels"]) >= 3

