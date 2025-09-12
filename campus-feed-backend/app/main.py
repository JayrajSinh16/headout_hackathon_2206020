from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.routes import router

def create_app() -> FastAPI:
    """Create and configure the FastAPI application"""
    
    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.VERSION,
        description="A campus community platform for sharing events, lost & found items, and announcements"
    )
    
    # Configure CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Include API routes
    app.include_router(router, prefix="/api", tags=["api"])
    
    # Root endpoint
    @app.get("/")
    async def root():
        return {"message": f"{settings.APP_NAME} is running", "version": settings.VERSION}
    
    return app

# Create the app instance
app = create_app()
