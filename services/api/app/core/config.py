import os
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Twitter Sentiment Analysis Platform"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    API_V1_STR: str = "/api/v1"
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super-secret-sentiment-key-min-32-chars-xyz-123456")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "http://localhost:8081",
        "http://127.0.0.1:8081",
        "*"
    ]
    
    # Database (Default to SQLite if PostgreSQL not specified or unavailable)
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./sentiment.db")
    
    # Redis
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    
    # Twitter / X API
    TWITTER_BEARER_TOKEN: str = os.getenv("TWITTER_BEARER_TOKEN", "")
    TWITTER_API_KEY: str = os.getenv("TWITTER_API_KEY", "")
    TWITTER_API_SECRET: str = os.getenv("TWITTER_API_SECRET", "")
    
    # NLP Engine
    NLP_ENGINE_MODE: str = os.getenv("NLP_ENGINE_MODE", "hybrid")
    TRANSFORMER_MODEL_NAME: str = os.getenv("TRANSFORMER_MODEL_NAME", "cardiffnlp/twitter-roberta-base-sentiment-latest")

    class Config:
        case_sensitive = True
        extra = "allow"

settings = Settings()
