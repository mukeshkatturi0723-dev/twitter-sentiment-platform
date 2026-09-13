# PulseAI — Real-Time Twitter Sentiment Analysis Platform

A full-stack, enterprise-grade Twitter Sentiment Analysis monorepo combining **Next.js 14**, **FastAPI**, a **hybrid NLP classification engine (RoBERTa + NLTK VADER)**, **React Native (Expo)** mobile application, **Docker Compose**, and **GitHub Actions CI/CD**.

---

## 1. Architecture Overview

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────────┐
│   Web Dashboard │     │   Mobile App      │     │   Admin Analytics   │
│ (Next.js 14)    │     │ (React Native)    │     │  (Comparative NSS)  │
└────────┬────────┘     └────────┬─────────┘     └──────────┬──────────┘
         │                        │                           │
         └────────────┬───────────┴───────────────────────────┘
                       │  REST & WebSockets (/ws/live-feed)
              ┌────────▼─────────┐
              │   FastAPI Gateway │
              │  Auth, Rate Limit │
              └────────┬─────────┘
                       │
        ┌──────────────┼───────────────────┐
        │              │                    │
┌───────▼──────┐ ┌─────▼──────┐   ┌─────────▼─────────┐
│ Ingestion     │ │ NLP Engine │   │ Data Store         │
│ (Tweepy/X API │ │ (RoBERTa + │   │ PostgreSQL / SQLite│
│ + Mock Pulsar)│ │ VADER)     │   │ + Redis Task Queue │
└───────────────┘ └────────────┘   └────────────────────┘
```

---

## 2. Monorepo Structure

```
twitter-sentiment-platform/
├── apps/
│   ├── web/                     # Next.js 14 (App Router) + TailwindCSS + Recharts
│   └── mobile/                  # React Native with Expo + expo-router
├── services/
│   ├── api/                     # Python FastAPI Backend (REST + WebSockets + SQLAlchemy)
│   └── nlp-worker/              # Celery worker & NLP Preprocessing
├── packages/
│   └── shared-types/            # Shared TypeScript type definitions
├── infra/
│   ├── docker-compose.yml       # Full stack container configuration
│   ├── nginx/                   # Reverse proxy configuration
│   └── github-actions/          # CI/CD workflows
├── docs/
│   └── API.md                   # OpenAPI specs and WebSocket documentation
└── README.md
```

---

## 3. Quickstart Guide (Local Development)

### Step 1: Start Backend API
```powershell
# In project root:
uvicorn services.api.app.main:app --reload --port 8000
```
- Interactive Swagger API Docs: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/health`
- The database automatically creates tables and seeds 32 realistic tweets and a demo user.

### Step 2: Start Web Dashboard
```powershell
cd apps/web
npm run dev
```
- Access web app: `http://localhost:3000`
- Demo login: `analyst@sentiment.ai` / `password123` (or click "⚡ Click to Fill Demo Credentials")

### Step 3: Run Unit Tests
```powershell
python -m pytest services/api/tests -v
```

---

## 4. Docker Deployment

To launch the complete containerized stack (PostgreSQL, Redis, FastAPI, Celery, and Next.js):
```bash
docker-compose -f infra/docker-compose.yml up --build
```

---

## 5. Core Features

1. **Hybrid Multi-Tier NLP Engine**:
   - Primary: Deep contextual RoBERTa / DistilBERT transformer scoring.
   - Fast Baseline: NLTK VADER rule-based lexicon scoring for high-throughput stream.
   - Fallback calibration: Robust built-in lexicon handling emojis (🚀, 😡, 🔥, 👎) and keywords.
2. **Real-Time WebSocket Feed (`/ws/live-feed`)**:
   - Streaming ticker auto-updates when tweets are ingested or simulated.
3. **Interactive Ad-Hoc Classifier**:
   - Live testing widget on the dashboard to test any tweet text with real-time probability breakdown.
4. **Comparative Brand Analytics**:
   - Benchmark Net Sentiment Score (NSS = % Positive - % Negative) across Apple, Google, Microsoft, OpenAI, Tesla, and Nvidia.
5. **CSV Batch Upload**:
   - Upload CSV datasets for high-speed batch sentiment classification and report download.
