import openai
import google.generativeai as genai
import json
from typing import Dict, Any
from abc import ABC, abstractmethod

from app.core.config import settings
from app.models.schemas import ClassifyResponse

class AIProvider(ABC):
    """Abstract base class for AI providers"""
    
    @abstractmethod
    async def classify_text(self, text: str) -> Dict[str, Any]:
        """Classify text and extract structured data"""
        pass

class OpenAIProvider(AIProvider):
    """OpenAI GPT provider"""
    
    def __init__(self):
        self.client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)
    
    async def classify_text(self, text: str) -> Dict[str, Any]:
        """Classify text using OpenAI GPT"""
        prompt = self._build_prompt(text)
        
        response = self.client.chat.completions.create(
            model=settings.OPENAI_MODEL,
            messages=[
                {
                    "role": "system",
                    "content": "You are an AI that classifies campus-related text into categories and extracts structured data. Always respond with valid JSON only."
                },
                {"role": "user", "content": prompt}
            ],
            max_tokens=settings.MAX_TOKENS,
            temperature=settings.TEMPERATURE
        )
        
        result = response.choices[0].message.content.strip()
        return self._parse_response(result, text)
    
    def _build_prompt(self, text: str) -> str:
        """Build the classification prompt"""
        return f"""
        Analyze the following text and classify it into one of these categories:
        - EVENT: workshops, fests, activities, meetings, competitions
        - LOST_FOUND: lost or found items
        - ANNOUNCEMENT: official notices, announcements, news
        
        Extract relevant information and return a JSON response with this exact structure:
        {{
            "type": "EVENT|LOST_FOUND|ANNOUNCEMENT",
            "title": "brief title (max 50 chars)",
            "description": "detailed description",
            "location": "location if mentioned or relevant",
            "date": "date/time if mentioned (format: YYYY-MM-DD or natural format)",
            "item_type": "lost or found (only for LOST_FOUND)",
            "department": "department name (only for ANNOUNCEMENT)"
        }}
        
        Text to analyze: "{text}"
        
        Return only the JSON response, no additional text.
        """
    
    def _parse_response(self, result: str, original_text: str) -> Dict[str, Any]:
        """Parse AI response and handle errors"""
        try:
            # Clean the result if it contains markdown code blocks
            if "```json" in result:
                result = result.split("```json")[1].split("```")[0].strip()
            elif "```" in result:
                result = result.split("```")[1].strip()
            
            return json.loads(result)
        except json.JSONDecodeError:
            # Fallback parsing if AI doesn't return pure JSON
            return self._fallback_classification(original_text)
    
    def _fallback_classification(self, text: str) -> Dict[str, Any]:
        """Fallback classification when AI fails"""
        text_lower = text.lower()
        
        if any(word in text_lower for word in ["lost", "found", "wallet", "phone", "keys", "bag"]):
            return {
                "type": "LOST_FOUND",
                "title": text[:50],
                "description": text,
                "item_type": "lost" if "lost" in text_lower else "found",
                "location": "Campus",
                "date": None,
                "department": None
            }
        elif any(word in text_lower for word in ["event", "workshop", "fest", "competition", "meeting"]):
            return {
                "type": "EVENT",
                "title": text[:50],
                "description": text,
                "location": "Campus",
                "date": None,
                "item_type": None,
                "department": None
            }
        else:
            return {
                "type": "ANNOUNCEMENT",
                "title": text[:50],
                "description": text,
                "department": "General",
                "location": None,
                "date": None,
                "item_type": None
            }

class GeminiProvider(AIProvider):
    """Google Gemini provider"""
    
    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel(settings.GEMINI_MODEL)
    
    async def classify_text(self, text: str) -> Dict[str, Any]:
        """Classify text using Google Gemini"""
        prompt = self._build_prompt(text)
        
        response = self.model.generate_content(prompt)
        result = response.text.strip()
        
        return self._parse_response(result, text)
    
    def _build_prompt(self, text: str) -> str:
        """Build the classification prompt (same as OpenAI for consistency)"""
        return f"""
        Analyze the following text and classify it into one of these categories:
        - EVENT: workshops, fests, activities, meetings, competitions
        - LOST_FOUND: lost or found items
        - ANNOUNCEMENT: official notices, announcements, news
        
        Extract relevant information and return a JSON response with this exact structure:
        {{
            "type": "EVENT|LOST_FOUND|ANNOUNCEMENT",
            "title": "brief title (max 50 chars)",
            "description": "detailed description",
            "location": "location if mentioned or relevant",
            "date": "date/time if mentioned (format: YYYY-MM-DD or natural format)",
            "item_type": "lost or found (only for LOST_FOUND)",
            "department": "department name (only for ANNOUNCEMENT)"
        }}
        
        Text to analyze: "{text}"
        
        Return only the JSON response, no additional text.
        """
    
    def _parse_response(self, result: str, original_text: str) -> Dict[str, Any]:
        """Parse AI response and handle errors"""
        try:
            # Clean the result if it contains markdown code blocks
            if "```json" in result:
                result = result.split("```json")[1].split("```")[0].strip()
            elif "```" in result:
                result = result.split("```")[1].strip()
            
            return json.loads(result)
        except json.JSONDecodeError:
            # Fallback parsing if AI doesn't return pure JSON
            return self._fallback_classification(original_text)
    
    def _fallback_classification(self, text: str) -> Dict[str, Any]:
        """Fallback classification when AI fails"""
        text_lower = text.lower()
        
        if any(word in text_lower for word in ["lost", "found", "wallet", "phone", "keys", "bag"]):
            return {
                "type": "LOST_FOUND",
                "title": text[:50],
                "description": text,
                "item_type": "lost" if "lost" in text_lower else "found",
                "location": "Campus",
                "date": None,
                "department": None
            }
        elif any(word in text_lower for word in ["event", "workshop", "fest", "competition", "meeting"]):
            return {
                "type": "EVENT",
                "title": text[:50],
                "description": text,
                "location": "Campus",
                "date": None,
                "item_type": None,
                "department": None
            }
        else:
            return {
                "type": "ANNOUNCEMENT",
                "title": text[:50],
                "description": text,
                "department": "General",
                "location": None,
                "date": None,
                "item_type": None
            }

class AIService:
    """Service for managing AI providers"""
    
    def __init__(self):
        self.providers = {
            "openai": OpenAIProvider(),
            "gemini": GeminiProvider()
        }
    
    async def classify_text(self, text: str, provider: str = "openai") -> ClassifyResponse:
        """Classify text using specified AI provider"""
        if provider not in self.providers:
            provider = "openai"  # Default fallback
        
        try:
            result = await self.providers[provider].classify_text(text)
            return ClassifyResponse(**result)
        except Exception as e:
            print(f"AI API error ({provider}): {e}")
            # Use fallback classification
            fallback_result = self.providers["openai"]._fallback_classification(text)
            return ClassifyResponse(**fallback_result)

# Global AI service instance
ai_service = AIService()
