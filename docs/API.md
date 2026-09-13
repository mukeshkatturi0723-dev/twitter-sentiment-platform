# Twitter Sentiment Analysis Platform — API Documentation

This document describes the RESTful API and real-time WebSocket protocol exposed by the FastAPI backend (`http://localhost:8000`).

---

## 1. Authentication Endpoints

### `POST /api/v1/auth/signup`
Creates a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "role": "analyst"
}
```

**Response (201 Created):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5c...",
  "token_type": "bearer",
  "expires_in": 86400,
  "user": {
    "id": "c1f72922-...",
    "email": "user@example.com",
    "role": "analyst",
    "created_at": "2026-09-13T12:00:00Z"
  }
}
```

### `POST /api/v1/auth/login`
Authenticates a user and returns a JWT access token.

**Request Body:**
```json
{
  "email": "analyst@sentiment.ai",
  "password": "password123"
}
```

---

## 2. Sentiment Classification & Tweets

### `POST /api/v1/tweets/classify`
Ad-hoc sentiment classification on arbitrary text (does not write to DB).

**Request Body:**
```json
{
  "text": "The new update is unbelievably fast and smooth! 🚀"
}
```

**Response (200 OK):**
```json
{
  "sentiment": "positive",
  "confidence": 0.942,
  "scores": {
    "positive": 0.89,
    "negative": 0.02,
    "neutral": 0.09
  },
  "engine": "vader",
  "cleaned_text": "The new update is unbelievably fast and smooth! 🚀",
  "keywords": ["update", "fast", "smooth"],
  "hashtags": []
}
```

### `GET /api/v1/tweets`
Paginated search and filter across ingested tweets.

**Query Parameters:**
| Parameter | Type | Default | Description |
|---|---|---|---|
| `query` | string | null | Text search across author, text, or hashtags |
| `sentiment` | string | null | Filter by `positive`, `negative`, `neutral`, or `all` |
| `from` | string (ISO) | null | Start timestamp |
| `to` | string (ISO) | null | End timestamp |
| `page` | integer | 1 | Page number |
| `limit` | integer | 20 | Tweets per page (max 100) |
| `sort_by` | string | `created_at` | Field to sort: `created_at`, `confidence`, `ingested_at` |
| `sort_order` | string | `desc` | `asc` or `desc` |

### `POST /api/v1/tweets/live-sample`
Generates an incoming sample tweet, classifies it, persists to DB, and broadcasts live over WebSocket.

---

## 3. Analytics Endpoints

### `GET /api/v1/analytics/summary`
Returns overall platform sentiment statistics, positive/negative percentages, 7-day delta, and average model confidence.

### `GET /api/v1/analytics/trend?keyword=&days=7`
Returns daily timeline data points of positive, negative, and neutral volumes.

### `GET /api/v1/analytics/keywords?limit=15`
Returns top trending hashtags and keywords with dominant sentiment classification.

### `GET /api/v1/analytics/compare?brands=Apple,Google,Tesla,Microsoft,OpenAI`
Returns side-by-side comparative sentiment metrics, share of voice, and Net Sentiment Score (NSS).

---

## 4. Batch Upload

### `POST /api/v1/upload`
Multipart file upload accepting a CSV file.

**Response (200 OK):**
```json
{
  "status": "success",
  "filename": "tweets.csv",
  "total_processed": 100,
  "breakdown": {
    "positive": 45,
    "negative": 30,
    "neutral": 25
  },
  "positive_percentage": 45.0,
  "negative_percentage": 30.0,
  "neutral_percentage": 25.0
}
```

---

## 5. WebSocket Live Feed

### `WS /ws/live-feed`
Connect to receive real-time updates as tweets are ingested.

**Incoming Events:**
```json
{
  "type": "NEW_TWEET",
  "data": {
    "id": "...",
    "author": "elonmusk_fan",
    "text": "The new AI updates are completely mindblowing! 🚀 #AI",
    "sentiment": "positive",
    "confidence": 0.94
  },
  "timestamp": "2026-09-13T12:00:00Z"
}
```
Client can send `"ping"` to receive `"PONG"`.
