"""
Syren Backend - FastAPI Application
"""
from datetime import timedelta

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.config import get_settings
from app.database import get_db, engine, Base
from app.models import User, Generation
from app.schemas import (
    UserCreate,
    UserResponse,
    Token,
    GenerationCreate,
    GenerationResponse,
    GenerationList,
    PaymentWebhook,
    PaymentWebhookResponse,
    CCBillWebhook,
    MessageResponse,
)
from app.auth import (
    get_password_hash,
    create_access_token,
    authenticate_user,
    get_current_user,
)

settings = get_settings()

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Syren API",
    description="AI Influencer Generator MVP Backend",
    version="0.1.0",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================
# Health Endpoints
# ============================================

@app.get("/", tags=["Health"])
async def root():
    """Root endpoint."""
    return {"message": "Welcome to Syren API", "status": "healthy"}


@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": "backend"}


# ============================================
# Auth Endpoints
# ============================================

@app.post("/auth/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED, tags=["Auth"])
async def signup(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user.
    New users receive 10 free credits.
    """
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        email=user_data.email,
        hashed_password=hashed_password,
        credit_balance=10,  # Free credits
        subscription_tier="free",
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user


@app.post("/auth/login", response_model=Token, tags=["Auth"])
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    """
    Authenticate user and return JWT token.
    Uses OAuth2 password flow (username field contains email).
    """
    user = authenticate_user(db, form_data.username, form_data.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(
        data={"sub": str(user.id)},
        expires_delta=timedelta(minutes=settings.access_token_expire_minutes),
    )
    
    return Token(access_token=access_token, token_type="bearer")


@app.get("/auth/me", response_model=UserResponse, tags=["Auth"])
async def get_me(current_user: User = Depends(get_current_user)):
    """Get current authenticated user's profile."""
    return current_user


# ============================================
# Generation Endpoints
# ============================================

@app.post("/generate", response_model=GenerationResponse, status_code=status.HTTP_201_CREATED, tags=["Generations"])
async def create_generation(
    generation_data: GenerationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Create a new AI image generation.
    Deducts 1 credit from user's balance.
    Returns task_id for tracking generation status.
    """
    # Check if user has credits
    if current_user.credit_balance < 1:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail="Insufficient credits. Please purchase more credits.",
        )
    
    # Deduct credit
    current_user.credit_balance -= 1
    
    # Create generation record
    new_generation = Generation(
        user_id=current_user.id,
        prompt=generation_data.prompt,
        status="pending",
    )
    
    db.add(new_generation)
    db.commit()
    db.refresh(new_generation)
    db.refresh(current_user)
    
    # Dispatch Celery task for AI generation
    # Using send_task to avoid importing worker code directly
    from celery import Celery
    celery = Celery(broker=settings.redis_url)
    celery.send_task(
        "generate_image_task",
        args=[new_generation.id, generation_data.prompt],
        queue="ai_generation",
    )
    
    return new_generation


@app.get("/generations", response_model=GenerationList, tags=["Generations"])
async def list_generations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 50,
):
    """
    Get list of current user's generations.
    Supports pagination with skip and limit.
    """
    generations = (
        db.query(Generation)
        .filter(Generation.user_id == current_user.id)
        .order_by(Generation.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    
    total = db.query(Generation).filter(Generation.user_id == current_user.id).count()
    
    return GenerationList(generations=generations, total=total)


@app.get("/generations/{generation_id}", response_model=GenerationResponse, tags=["Generations"])
async def get_generation(
    generation_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get a specific generation by ID."""
    generation = (
        db.query(Generation)
        .filter(Generation.id == generation_id, Generation.user_id == current_user.id)
        .first()
    )
    
    if not generation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Generation not found",
        )
    
    return generation


# ============================================
# Payment Endpoints
# ============================================

@app.post("/webhook/payment", response_model=PaymentWebhookResponse, tags=["Payments"])
async def payment_webhook(
    webhook_data: PaymentWebhook,
    db: Session = Depends(get_db),
):
    """
    Payment webhook endpoint (stub).
    Will be implemented with actual payment provider integration.
    """
    # TODO: Implement actual payment webhook handling
    # - Verify webhook signature
    # - Process payment events
    # - Add credits to user account
    
    if webhook_data.event_type == "payment.completed":
        if webhook_data.user_email and webhook_data.credits:
            user = db.query(User).filter(User.email == webhook_data.user_email).first()
            if user:
                user.credit_balance += webhook_data.credits
                db.commit()
                return PaymentWebhookResponse(
                    status="success",
                    message=f"Added {webhook_data.credits} credits to {webhook_data.user_email}",
                )
    
    return PaymentWebhookResponse(
        status="received",
        message="Webhook received (stub implementation)",
    )


@app.post("/webhooks/ccbill", response_model=PaymentWebhookResponse, tags=["Payments"])
async def ccbill_webhook(
    token: str = "",
    webhook_data: CCBillWebhook = None,
    db: Session = Depends(get_db),
):
    """
    CCBill payment webhook endpoint.
    
    Verifies signature via query param token, then:
    - Finds user by custom_field_user_id
    - Updates subscription_tier to 'pro'
    - Adds 500 credits to credit_balance
    
    Always returns 200 OK to prevent webhook retries.
    """
    import logging
    logger = logging.getLogger(__name__)
    
    try:
        # Signature verification (stub logic)
        # In production, use proper HMAC signature verification
        if token != settings.webhook_secret:
            logger.warning(f"CCBill webhook: Invalid token received")
            # Still return 200 to prevent retries, but don't process
            return PaymentWebhookResponse(
                status="error",
                message="Invalid signature",
            )
        
        # Validate payload
        if not webhook_data or not webhook_data.custom_field_user_id:
            logger.warning("CCBill webhook: Missing user_id in payload")
            return PaymentWebhookResponse(
                status="error",
                message="Missing custom_field_user_id",
            )
        
        user_id = webhook_data.custom_field_user_id
        subscription_id = webhook_data.subscription_id
        
        # Find user
        user = db.query(User).filter(User.id == user_id).first()
        
        if not user:
            logger.error(f"CCBill webhook: User {user_id} not found")
            return PaymentWebhookResponse(
                status="error",
                message=f"User {user_id} not found",
            )
        
        # Update subscription and credits
        user.subscription_tier = "pro"
        user.credit_balance += 500
        
        db.commit()
        
        logger.info(f"CCBill webhook: User {user_id} upgraded to pro, added 500 credits. Subscription: {subscription_id}")
        
        return PaymentWebhookResponse(
            status="success",
            message=f"User {user_id} upgraded to pro with 500 credits",
        )
    
    except Exception as e:
        logger.exception(f"CCBill webhook error: {e}")
        # Always return 200 to prevent retries
        return PaymentWebhookResponse(
            status="error",
            message="Internal error (logged)",
        )


# ============================================
# Checkout Session (Mock for CCBill/Segpay)
# ============================================

class CheckoutSessionRequest(BaseModel):
    plan_id: str


class CheckoutSessionResponse(BaseModel):
    checkout_url: str
    session_id: str


from pydantic import BaseModel


@app.post("/create-checkout-session", response_model=CheckoutSessionResponse, tags=["Payments"])
async def create_checkout_session(
    request: CheckoutSessionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Create a checkout session for subscription payment.
    
    In production, this will:
    1. Create a pending transaction record
    2. Generate CCBill/Segpay checkout URL with custom fields
    3. Return the payment provider URL
    
    For now, returns a mock URL for testing.
    """
    import uuid
    
    # Generate session ID
    session_id = str(uuid.uuid4())
    
    # Plan pricing (for reference)
    plans = {
        "weekly": {"price": 7.99, "credits": 500},
        "monthly": {"price": 29.99, "credits": 999999},  # Unlimited
    }
    
    if request.plan_id not in plans:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid plan_id: {request.plan_id}",
        )
    
    # In production: Create CCBill/Segpay URL with:
    # - custom_field_user_id = current_user.id
    # - custom_field_plan_id = request.plan_id
    # - custom_field_session_id = session_id
    
    # Mock URL for testing - redirects to success page
    mock_checkout_url = f"http://localhost:3000/success?session_id={session_id}&plan={request.plan_id}&user_id={current_user.id}&mock_payment=true"
    
    return CheckoutSessionResponse(
        checkout_url=mock_checkout_url,
        session_id=session_id,
    )
