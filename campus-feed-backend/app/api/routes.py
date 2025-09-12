from fastapi import APIRouter, HTTPException

from app.models.schemas import (
    ClassifyRequest, ClassifyResponse,
    PostRequest, PostResponse,
    RSVPRequest
)
from app.services.ai_service import ai_service
from app.storage.posts import post_storage

router = APIRouter()

@router.post("/classify", response_model=ClassifyResponse)
async def classify_text(request: ClassifyRequest):
    """Classify user input using AI and extract relevant fields"""
    return await ai_service.classify_text(request.text, request.ai_provider)

@router.post("/posts")
async def create_post(post: PostRequest):
    """Create a new post"""
    post_data = {
        "type": post.type,
        "title": post.title,
        "description": post.description,
        "location": post.location,
        "date": post.date,
        "item_type": post.item_type,
        "department": post.department,
        "user_id": post.user_id,
    }
    
    new_post = post_storage.create_post(post_data)
    return {"message": "Post created successfully", "id": new_post["id"]}

@router.get("/posts")
async def get_posts():
    """Get all posts ordered by creation time (newest first)"""
    return post_storage.get_all_posts()

@router.post("/posts/{post_id}/rsvp")
async def update_rsvp(post_id: str, rsvp: RSVPRequest):
    """Update RSVP status for an event"""
    try:
        rsvp_counts = post_storage.update_post_rsvp(post_id, rsvp.user_id, rsvp.status)
        return {"message": "RSVP updated successfully", "rsvp_counts": rsvp_counts}
    except ValueError as e:
        if "Post not found" in str(e):
            raise HTTPException(status_code=404, detail="Post not found")
        elif "RSVP only available for events" in str(e):
            raise HTTPException(status_code=400, detail="RSVP only available for events")
        else:
            raise HTTPException(status_code=400, detail=str(e))
