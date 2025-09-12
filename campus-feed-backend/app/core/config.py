from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

class Settings:
    """Application settings"""
    
    # API Keys
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    
    # CORS Settings
    ALLOWED_ORIGINS: list = [
        "http://localhost:3000",
        "http://localhost:5173",
    ]
    
    # AI Settings
    OPENAI_MODEL: str = "gpt-5-mini"
    GEMINI_MODEL: str = "gemini-2.0-flash"
    MAX_TOKENS: int = 300
    TEMPERATURE: float = 0.3
    
    # Server Settings
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # Application Settings
    APP_NAME: str = "Campus Feed API"
    VERSION: str = "1.0.0"

settings = Settings()
