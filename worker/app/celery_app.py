"""
Syren Worker - Celery Application Configuration
"""
import os
from celery import Celery

# Environment variables
REDIS_URL = os.getenv("REDIS_URL", "redis://redis:6379/0")

# Create Celery app with Redis as broker and backend
celery_app = Celery(
    "syren_worker",
    broker=REDIS_URL,
    backend=REDIS_URL,
    include=["app.tasks"],
)

# Celery configuration
celery_app.conf.update(
    # Serialization
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    
    # Timezone
    timezone="UTC",
    enable_utc=True,
    
    # Task tracking
    task_track_started=True,
    task_acks_late=True,
    
    # Timeouts
    task_time_limit=600,       # 10 minutes max per task
    task_soft_time_limit=540,  # Soft limit at 9 minutes
    
    # Worker settings
    worker_prefetch_multiplier=1,  # One task at a time for long-running tasks
    worker_concurrency=2,
    
    # Result settings
    result_expires=3600,  # Results expire after 1 hour
    
    # Retry settings
    task_default_retry_delay=5,
    task_max_retries=3,
)

# Task routes (optional, for future scaling)
celery_app.conf.task_routes = {
    "app.tasks.generate_image_task": {"queue": "ai_generation"},
}
