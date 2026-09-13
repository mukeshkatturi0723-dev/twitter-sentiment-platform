# Deployment Guide — PulseAI Sentiment Analysis Platform

This guide covers all deployment options for the Twitter Sentiment Analysis platform, ranging from 1-click free cloud hosting to full Docker containerization.

---

## Option 1: 1-Click Free Cloud Deployment (Render Blueprint)

We have provided a complete `render.yaml` blueprint that deploys:
- **`pulseai-web`**: Next.js 14 frontend.
- **`pulseai-api`**: FastAPI Python backend.
- **`pulseai-db`**: Free managed PostgreSQL database.
- **`pulseai-redis`**: Free managed Redis instance.
- **`pulseai-nlp-worker`**: Celery background scoring worker.

### Steps:
1. Push this repository to GitHub or GitLab.
2. Sign in to [Render.com](https://render.com).
3. Click **New +** -> **Blueprint**.
4. Select your repository. Render will automatically read `render.yaml` and provision all 5 services with SSL and live `.onrender.com` URLs!

---

## Option 2: Split Cloud (Vercel Frontend + Render Backend)

### 1. Deploy Frontend to Vercel
1. Go to [Vercel.com](https://vercel.com) and import the repository.
2. Set **Root Directory** to `apps/web`.
3. Add Environment Variables:
   - `NEXT_PUBLIC_API_URL`: Your deployed backend URL (e.g., `https://pulseai-api.onrender.com`).
   - `NEXT_PUBLIC_WS_URL`: Your deployed WebSocket URL (e.g., `wss://pulseai-api.onrender.com/ws/live-feed`).
4. Click **Deploy**. Vercel will give you an instant `https://your-project.vercel.app` live link.

### 2. Deploy Backend to Render / Railway
1. In Render, select **New +** -> **Web Service**.
2. Point to the repository.
3. Build Command: `pip install -r services/api/requirements.txt && python -c 'import nltk; nltk.download("vader_lexicon", quiet=True)'`
4. Start Command: `uvicorn services.api.app.main:app --host 0.0.0.0 --port $PORT`

---

## Option 3: Full Docker Compose (Any Cloud VPS / AWS / DigitalOcean)

Run the whole stack on any server running Linux/macOS/Windows with Docker:

```bash
# 1. Clone repository
git clone <your-repo-url>
cd <repo-folder>

# 2. Start all services in background
docker compose -f infra/docker-compose.yml up -d --build
```

### Services Started:
- Frontend Web: `http://<server-ip>:3000`
- API Backend: `http://<server-ip>:8000`
- Swagger Docs: `http://<server-ip>:8000/docs`
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`
