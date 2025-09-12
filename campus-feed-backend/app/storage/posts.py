from typing import List, Dict, Any, Optional
from datetime import datetime
import uuid

class PostStorage:
    """In-memory storage for posts"""
    
    def __init__(self):
        self._posts: List[Dict[str, Any]] = self._initialize_demo_data()
    
    def _initialize_demo_data(self) -> List[Dict[str, Any]]:
        """Initialize with demo data"""
        return [
            {
                "id": "demo_post_1",
                "type": "EVENT",
                "title": "Tech Workshop: React & FastAPI",
                "description": "Join us for an intensive workshop on building full-stack applications with React and FastAPI. Perfect for students looking to enhance their web development skills.",
                "location": "Computer Science Lab, Building A",
                "date": "Tomorrow, 2:00 PM",
                "item_type": None,
                "department": None,
                "user_id": "user_mahesh",
                "created_at": "2025-09-12T10:00:00Z",
                "rsvp_counts": {"going": 76, "interested": 183, "not_going": 4},
                "user_rsvps": {}
            }
        ]
    
    def create_post(self, post_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new post"""
        new_post = {
            "id": str(uuid.uuid4()),
            **post_data,
            "created_at": datetime.now().isoformat(),
            "rsvp_counts": {"going": 0, "interested": 0, "not_going": 0} if post_data["type"] == "EVENT" else None,
            "user_rsvps": {} if post_data["type"] == "EVENT" else None
        }
        
        self._posts.append(new_post)
        return new_post
    
    def get_all_posts(self) -> List[Dict[str, Any]]:
        """Get all posts ordered by creation time (newest first)"""
        return sorted(self._posts, key=lambda x: x["created_at"], reverse=True)
    
    def get_post_by_id(self, post_id: str) -> Optional[Dict[str, Any]]:
        """Get a post by its ID"""
        return next((post for post in self._posts if post["id"] == post_id), None)
    
    def update_post_rsvp(self, post_id: str, user_id: str, status: str) -> Dict[str, Any]:
        """Update RSVP status for a post"""
        post = self.get_post_by_id(post_id)
        if not post:
            raise ValueError("Post not found")
        
        if post["type"] != "EVENT":
            raise ValueError("RSVP only available for events")
        
        # Remove previous RSVP from this user
        if post["user_rsvps"] and user_id in post["user_rsvps"]:
            old_status = post["user_rsvps"][user_id]
            post["rsvp_counts"][old_status] = max(0, post["rsvp_counts"][old_status] - 1)
        
        # Add new RSVP
        if not post["user_rsvps"]:
            post["user_rsvps"] = {}
        
        post["user_rsvps"][user_id] = status
        post["rsvp_counts"][status] += 1
        
        return post["rsvp_counts"]

# Global storage instance
post_storage = PostStorage()
