"""
Syren Worker - Configuration
"""
import os
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Worker settings loaded from environment variables."""
    
    # Database
    database_url: str = "postgresql://syren:syren_secret@db:5432/syren_db"
    
    # Redis
    redis_url: str = "redis://redis:6379/0"
    
    # RunPod
    runpod_api_key: str = ""
    runpod_endpoint_id: str = ""
    runpod_timeout_seconds: int = 300  # 5 minute timeout
    runpod_poll_interval: float = 2.0  # Poll every 2 seconds
    
    class Config:
        env_file = ".env"
        extra = "ignore"


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
