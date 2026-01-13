"""
Syren Worker - Celery Tasks with RunPod Integration
"""
import time
import logging
from typing import Optional, Dict, Any

import requests
from celery import states
from celery.exceptions import SoftTimeLimitExceeded

from app.celery_app import celery_app
from app.config import get_settings
from app.database import get_db_session
from app.models import Generation, User

# Configure logging
logger = logging.getLogger(__name__)

settings = get_settings()


class RunPodError(Exception):
    """Custom exception for RunPod errors."""
    pass


def build_comfyui_payload(prompt: str, generation_id: int) -> Dict[str, Any]:
    """
    Build a ComfyUI-compatible workflow payload for RunPod.
    
    This is a template payload - adjust based on your specific ComfyUI workflow.
    """
    return {
        "input": {
            "workflow": {
                # ComfyUI workflow structure
                "3": {
                    "class_type": "KSampler",
                    "inputs": {
                        "seed": generation_id,  # Use generation ID for reproducibility
                        "steps": 20,
                        "cfg": 7.5,
                        "sampler_name": "euler",
                        "scheduler": "normal",
                        "denoise": 1.0,
                        "model": ["4", 0],
                        "positive": ["6", 0],
                        "negative": ["7", 0],
                        "latent_image": ["5", 0]
                    }
                },
                "4": {
                    "class_type": "CheckpointLoaderSimple",
                    "inputs": {
                        "ckpt_name": "realvisxlV40.safetensors"
                    }
                },
                "5": {
                    "class_type": "EmptyLatentImage",
                    "inputs": {
                        "width": 1024,
                        "height": 1024,
                        "batch_size": 1
                    }
                },
                "6": {
                    "class_type": "CLIPTextEncode",
                    "inputs": {
                        "text": prompt,
                        "clip": ["4", 1]
                    }
                },
                "7": {
                    "class_type": "CLIPTextEncode",
                    "inputs": {
                        "text": "blurry, bad quality, distorted, ugly, deformed",
                        "clip": ["4", 1]
                    }
                },
                "8": {
                    "class_type": "VAEDecode",
                    "inputs": {
                        "samples": ["3", 0],
                        "vae": ["4", 2]
                    }
                },
                "9": {
                    "class_type": "SaveImage",
                    "inputs": {
                        "filename_prefix": f"syren_{generation_id}",
                        "images": ["8", 0]
                    }
                }
            }
        }
    }


def submit_to_runpod(payload: Dict[str, Any]) -> str:
    """
    Submit a job to RunPod serverless endpoint.
    
    Returns:
        str: RunPod job ID for polling
    """
    endpoint_url = f"https://api.runpod.ai/v2/{settings.runpod_endpoint_id}/run"
    
    headers = {
        "Authorization": f"Bearer {settings.runpod_api_key}",
        "Content-Type": "application/json"
    }
    
    response = requests.post(
        endpoint_url,
        json=payload,
        headers=headers,
        timeout=30
    )
    
    if response.status_code != 200:
        raise RunPodError(f"RunPod submission failed: {response.status_code} - {response.text}")
    
    data = response.json()
    job_id = data.get("id")
    
    if not job_id:
        raise RunPodError(f"No job ID in RunPod response: {data}")
    
    logger.info(f"RunPod job submitted: {job_id}")
    return job_id


def poll_runpod_status(job_id: str) -> Dict[str, Any]:
    """
    Poll RunPod job status until completion or failure.
    
    Returns:
        dict: Final job result with output data
    """
    status_url = f"https://api.runpod.ai/v2/{settings.runpod_endpoint_id}/status/{job_id}"
    
    headers = {
        "Authorization": f"Bearer {settings.runpod_api_key}",
    }
    
    start_time = time.time()
    
    while True:
        # Check timeout
        elapsed = time.time() - start_time
        if elapsed > settings.runpod_timeout_seconds:
            raise RunPodError(f"RunPod job timed out after {elapsed:.0f} seconds")
        
        # Poll status
        response = requests.get(status_url, headers=headers, timeout=30)
        
        if response.status_code != 200:
            raise RunPodError(f"RunPod status check failed: {response.status_code}")
        
        data = response.json()
        status = data.get("status")
        
        logger.info(f"RunPod job {job_id} status: {status}")
        
        if status == "COMPLETED":
            return data
        
        elif status == "FAILED":
            error = data.get("error", "Unknown error")
            raise RunPodError(f"RunPod job failed: {error}")
        
        elif status == "CANCELLED":
            raise RunPodError("RunPod job was cancelled")
        
        elif status in ("IN_QUEUE", "IN_PROGRESS"):
            # Still processing, wait and poll again
            time.sleep(settings.runpod_poll_interval)
        
        else:
            # Unknown status, keep polling
            time.sleep(settings.runpod_poll_interval)


def extract_image_url(runpod_result: Dict[str, Any]) -> Optional[str]:
    """
    Extract the generated image URL from RunPod result.
    
    The structure depends on your ComfyUI workflow output.
    """
    output = runpod_result.get("output", {})
    
    # Try common output structures
    # Structure 1: Direct image URL
    if isinstance(output, str):
        return output
    
    # Structure 2: Output with images array
    if isinstance(output, dict):
        images = output.get("images", [])
        if images and len(images) > 0:
            return images[0].get("url") or images[0].get("image")
        
        # Structure 3: Direct URL in output
        if "url" in output:
            return output["url"]
        
        if "image_url" in output:
            return output["image_url"]
    
    # Structure 4: List output
    if isinstance(output, list) and len(output) > 0:
        first_output = output[0]
        if isinstance(first_output, str):
            return first_output
        if isinstance(first_output, dict):
            return first_output.get("url") or first_output.get("image")
    
    logger.warning(f"Could not extract image URL from output: {output}")
    return None


def update_generation_status(
    generation_id: int,
    status: str,
    image_url: Optional[str] = None,
    refund_credit: bool = False
) -> None:
    """
    Update the generation record in the database.
    
    Args:
        generation_id: ID of the generation to update
        status: New status (completed, failed)
        image_url: URL of generated image (if completed)
        refund_credit: Whether to refund the user's credit (on failure)
    """
    db = get_db_session()
    
    try:
        generation = db.query(Generation).filter(Generation.id == generation_id).first()
        
        if not generation:
            logger.error(f"Generation {generation_id} not found")
            return
        
        # Update generation
        generation.status = status
        if image_url:
            generation.image_url = image_url
        
        # Refund credit on failure
        if refund_credit:
            user = db.query(User).filter(User.id == generation.user_id).first()
            if user:
                user.credit_balance += 1
                logger.info(f"Refunded 1 credit to user {user.id}")
        
        db.commit()
        logger.info(f"Generation {generation_id} updated: status={status}")
        
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to update generation {generation_id}: {e}")
        raise
    finally:
        db.close()


@celery_app.task(
    bind=True,
    name="generate_image_task",
    max_retries=2,
    default_retry_delay=10,
    soft_time_limit=540,
    time_limit=600,
)
def generate_image_task(self, generation_id: int, prompt: str) -> Dict[str, Any]:
    """
    Generate an AI influencer image using RunPod ComfyUI.
    
    This task:
    1. Submits a job to RunPod
    2. Polls for completion every 2 seconds
    3. Updates the database with the result
    4. Refunds credit on failure
    
    Args:
        generation_id: ID of the generation record
        prompt: Text prompt for image generation
    
    Returns:
        dict: Result with status and image URL
    """
    logger.info(f"Starting generation {generation_id} with prompt: {prompt[:50]}...")
    
    # Update task state
    self.update_state(
        state="PROGRESS",
        meta={"status": "Submitting to RunPod", "generation_id": generation_id}
    )
    
    try:
        # Check if RunPod is configured
        if not settings.runpod_api_key or not settings.runpod_endpoint_id:
            raise RunPodError("RunPod API key or endpoint ID not configured")
        
        # Build payload
        payload = build_comfyui_payload(prompt, generation_id)
        
        # Submit to RunPod
        self.update_state(
            state="PROGRESS",
            meta={"status": "Job submitted, waiting for completion", "generation_id": generation_id}
        )
        job_id = submit_to_runpod(payload)
        
        # Poll for completion
        self.update_state(
            state="PROGRESS",
            meta={"status": "Generating image...", "generation_id": generation_id, "job_id": job_id}
        )
        result = poll_runpod_status(job_id)
        
        # Extract image URL
        image_url = extract_image_url(result)
        
        if not image_url:
            raise RunPodError("No image URL in RunPod output")
        
        # Update database with success
        update_generation_status(generation_id, "completed", image_url=image_url)
        
        logger.info(f"Generation {generation_id} completed: {image_url}")
        
        return {
            "status": "completed",
            "generation_id": generation_id,
            "image_url": image_url,
        }
    
    except SoftTimeLimitExceeded:
        logger.error(f"Generation {generation_id} timed out")
        update_generation_status(generation_id, "failed", refund_credit=True)
        
        return {
            "status": "failed",
            "generation_id": generation_id,
            "error": "Task timed out",
        }
    
    except RunPodError as e:
        logger.error(f"RunPod error for generation {generation_id}: {e}")
        update_generation_status(generation_id, "failed", refund_credit=True)
        
        # Retry on transient errors
        if "timeout" in str(e).lower() or "rate limit" in str(e).lower():
            raise self.retry(exc=e)
        
        return {
            "status": "failed",
            "generation_id": generation_id,
            "error": str(e),
        }
    
    except Exception as e:
        logger.exception(f"Unexpected error for generation {generation_id}: {e}")
        update_generation_status(generation_id, "failed", refund_credit=True)
        
        return {
            "status": "failed",
            "generation_id": generation_id,
            "error": str(e),
        }


@celery_app.task(name="health_check")
def health_check() -> Dict[str, str]:
    """Simple health check task for monitoring."""
    return {"status": "healthy", "service": "worker"}
