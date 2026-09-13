import asyncio
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from services.api.app.core.config import settings
from services.api.app.core.websocket import manager
from services.api.app.db.session import engine, Base
from services.api.app.seed import seed_database
from services.api.app.routers import auth_router, tweets_router, upload_router, analytics_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Ensure tables created and seed data loaded
    print("[Startup] Initializing Database & Seeding initial data...")
    Base.metadata.create_all(bind=engine)
    seed_database()
    print("[Startup] Sentiment Platform API Ready!")
    yield
    print("[Shutdown] Cleaning up API resources...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description="Real-Time Twitter Sentiment Analysis Platform API with hybrid NLP engine",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routers
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(tweets_router, prefix=settings.API_V1_STR)
app.include_router(upload_router, prefix=settings.API_V1_STR)
app.include_router(analytics_router, prefix=settings.API_V1_STR)

@app.get("/", tags=["health"])
def root():
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "version": "1.0.0",
        "docs": "/docs",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

@app.get("/health", tags=["health"])
def health():
    return {"status": "healthy"}

@app.websocket("/ws/live-feed")
async def websocket_live_feed(websocket: WebSocket):
    await manager.connect(websocket)
    # Send initial welcome / connected status
    await manager.send_personal_message({
        "type": "CONNECTED",
        "message": "Connected to Twitter Sentiment Live Stream",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }, websocket)

    try:
        while True:
            # Receive client messages / queries / heartbeat pings
            data = await websocket.receive_text()
            if data == "ping":
                await manager.send_personal_message({
                    "type": "PONG",
                    "timestamp": datetime.now(timezone.utc).isoformat()
                }, websocket)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception:
        manager.disconnect(websocket)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("services.api.app.main:app", host="0.0.0.0", port=8000, reload=True)
