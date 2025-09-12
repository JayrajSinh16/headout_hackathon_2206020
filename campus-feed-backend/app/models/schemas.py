from pydantic import BaseModel
from typing import Optional
from enum import Enum

class PostType(str, Enum):
    """Post type enumeration"""
    EVENT = "EVENT"
    LOST_AND_FOUND = "LOST_AND_FOUND"
    ANNOUNCEMENT = "ANNOUNCEMENT"
    ACADEMIC = "ACADEMIC"
    CLUBS_AND_SOCIETIES = "CLUBS_AND_SOCIETIES"
    OTHER = "OTHER"

class ClassifyRequest(BaseModel):
    """Request model for text classification"""
    text: str
    ai_provider: Optional[str] = "openai"  # "openai" or "gemini"

class ClassifyResponse(BaseModel):
    """Response model for text classification"""
    type: str
    title: str
    description: str
    location: Optional[str] = None
    date: Optional[str] = None
    item_type: Optional[str] = None
    department: Optional[str] = None

class PostRequest(BaseModel):
    """Request model for creating a post"""
    type: str
    title: str
    description: str
    location: Optional[str] = None
    date: Optional[str] = None
    item_type: Optional[str] = None
    department: Optional[str] = None
    user_id: str

class RSVPRequest(BaseModel):
    """Request model for RSVP updates"""
    user_id: str
    status: str  # "going", "interested", "not_going"

class PostResponse(BaseModel):
    """Response model for posts"""
    id: str
    type: str
    title: str
    description: str
    location: Optional[str] = None
    date: Optional[str] = None
    item_type: Optional[str] = None
    department: Optional[str] = None
    user_id: str
    created_at: str
    rsvp_counts: Optional[dict] = None
    user_rsvps: Optional[dict] = None
