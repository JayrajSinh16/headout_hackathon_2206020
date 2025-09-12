from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

class Settings:
    """Application settings"""
    
    # API Keys
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    GEMINI_API_KEY: str = os.getenv("GOOGLE_API_KEY", "")
    OPENROUTER_API_KEY: str = os.getenv("OPEN_ROUTER_KEY", "")
    
    # CORS Settings
    ALLOWED_ORIGINS: list = [
        "http://localhost:3000",
        "http://localhost:5173",
    ]
    
    # AI Settings
    OPENAI_MODEL: str = "gpt-3.5-turbo"
    GEMINI_MODEL: str = "gemini-1.5-flash"
    OPENROUTER_MODEL: str = os.getenv("OPEN_ROUTER_MODEL", "deepseek/deepseek-r1-0528-qwen3-8b:free")
    MAX_TOKENS: int = 300
    TEMPERATURE: float = 0.3
    
    # Server Settings
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # Application Settings
    APP_NAME: str = "Campus Feed API"
    VERSION: str = "1.0.0"

settings = Settings()
