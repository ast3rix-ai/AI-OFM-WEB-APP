"""
Syren Backend - Pydantic Schemas
"""
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field


# ============================================
# Auth Schemas
# ============================================

class UserCreate(BaseModel):
    """Schema for user registration."""
    email: EmailStr
    password: str = Field(..., min_length=8, description="Password must be at least 8 characters")


class UserLogin(BaseModel):
    """Schema for user login."""
    email: EmailStr
    password: str


class Token(BaseModel):
    """Schema for JWT token response."""
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    """Schema for decoded token data."""
    user_id: Optional[int] = None


class UserResponse(BaseModel):
    """Schema for user response (public data only)."""
    id: int
    email: str
    credit_balance: int
    subscription_tier: str
    created_at: datetime

    class Config:
        from_attributes = True


# ============================================
# Generation Schemas
# ============================================

class GenerationCreate(BaseModel):
    """Schema for creating a new generation."""
    prompt: str = Field(..., min_length=1, max_length=1000, description="Image generation prompt")


class GenerationResponse(BaseModel):
    """Schema for generation response."""
    id: int
    status: str
    image_url: Optional[str] = None
    prompt: str
    created_at: datetime

    class Config:
        from_attributes = True


class GenerationList(BaseModel):
    """Schema for list of generations."""
    generations: List[GenerationResponse]
    total: int


# ============================================
# Payment Schemas
# ============================================

class PaymentWebhook(BaseModel):
    """Schema for payment webhook (stub)."""
    event_type: str
    user_email: Optional[str] = None
    amount: Optional[int] = None
    credits: Optional[int] = None


class PaymentWebhookResponse(BaseModel):
    """Schema for payment webhook response."""
    status: str
    message: str


class CCBillWebhook(BaseModel):
    """Schema for CCBill webhook payload."""
    custom_field_user_id: Optional[int] = None
    subscription_id: Optional[str] = None
    event_type: Optional[str] = None
    # CCBill sends many other fields, we only parse what we need


# ============================================
# Common Schemas
# ============================================

class MessageResponse(BaseModel):
    """Schema for generic message response."""
    message: str


class ErrorResponse(BaseModel):
    """Schema for error response."""
    detail: str
