"""
AI Service using LangChain for LLM integration
Provides text classification for campus-related content
"""

import json
import demjson3
from typing import Dict, Any, Optional
from abc import ABC, abstractmethod

from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_openai import ChatOpenAI
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.exceptions import OutputParserException

from app.core.config import settings
from app.models.schemas import ClassifyResponse


class BaseLLMProvider(ABC):
    """Abstract base class for LLM providers using LangChain"""
    
    def __init__(self):
        self.parser = JsonOutputParser()
        self.prompt_template = self._create_prompt_template()
        
    @abstractmethod
    def _get_llm(self):
        """Get the LLM instance"""
        pass
    
    def _create_prompt_template(self) -> PromptTemplate:
        """Create the classification prompt template"""
        template = """
        You are an expert AI assistant that classifies campus-related text into specific categories.
        
        Analyze the following text and classify it into one of these categories:
        - EVENT: workshops, fests, activities, meetings, competitions, seminars
        - LOST_FOUND: lost or found items, belongings
        - ANNOUNCEMENT: official notices, announcements, news, updates
        
        Extract relevant information and return a JSON response with this EXACT structure:
        {{
            "type": "EVENT|LOST_FOUND|ANNOUNCEMENT",
            "title": "brief descriptive title (max 50 chars)",
            "description": "detailed description of the content",
            "location": "specific location mentioned or null if not found",
            "date": "date/time mentioned or null if not found",
            "item_type": "lost or found (only for LOST_FOUND category, otherwise null)",
            "department": "department name (only for ANNOUNCEMENT category, otherwise null)"
        }}
        
        CRITICAL EXTRACTION RULES:
        1. Extract EXACT location mentioned (e.g., "CV Raman Hall", "Library", "Main Auditorium") - DO NOT use "Campus"
        2. Extract EXACT date/time mentioned (e.g., "12 aug at 7 pm", "tomorrow 3 PM", "Aug 12")
        3. For LOST_FOUND: item_type should be the specific item (e.g., "iPhone", "wallet", "keys")
        4. For ANNOUNCEMENT: department should be the specific department mentioned
        5. Use null (not "Campus" or generic terms) if information is not explicitly mentioned
        6. Return ONLY valid JSON, no additional text or formatting
        
        Examples:
        - "Workshop on AI/ML at CV Raman Hall on 12 aug at 7 pm" → location: "CV Raman Hall", date: "12 aug at 7 pm"
        - "Lost my iPhone in library yesterday" → location: "library", item_type: "iPhone", date: "yesterday"
        - "Car racing event for 1st year students" → location: null (if not mentioned), date: null (if not mentioned)
        
        Text to analyze: "{text}"
        
        {format_instructions}
        """
        
        return PromptTemplate(
            template=template,
            input_variables=["text"],
            partial_variables={"format_instructions": self.parser.get_format_instructions()}
        )
    
    async def classify_text(self, text: str) -> Dict[str, Any]:
        """Classify text using LangChain"""
        try:
            llm = self._get_llm()
            chain = self.prompt_template | llm | self.parser
            
            print(f"🔗 LangChain processing: {text[:50]}...")
            
            result = await chain.ainvoke({"text": text})
            
            print(f"✅ LangChain result: {result}")
            return result
            
        except OutputParserException as e:
            print(f"⚠️  JSON parsing failed, trying fallback: {e}")
            return self._fallback_parse(str(e), text)
            
        except Exception as e:
            print(f"❌ LLM error: {e}")
            return self._fallback_classification(text)
    
    def _fallback_parse(self, raw_output: str, original_text: str) -> Dict[str, Any]:
        """Fallback parsing when LangChain parser fails"""
        try:
            # Extract JSON from error message or raw output
            if "```json" in raw_output:
                json_str = raw_output.split("```json")[1].split("```")[0].strip()
            elif "```" in raw_output:
                json_str = raw_output.split("```")[1].strip()
            else:
                json_str = raw_output
            
            # Try demjson3 for more forgiving parsing
            try:
                return json.loads(json_str)
            except json.JSONDecodeError:
                print(f"Standard JSON failed, trying demjson3...")
                return demjson3.decode(json_str)
                
        except Exception as e:
            print(f"All parsing methods failed: {e}")
            return self._fallback_classification(original_text)
    
    def _fallback_classification(self, text: str) -> Dict[str, Any]:
        """Manual fallback classification when AI fails"""
        text_lower = text.lower()
        
        # Simple keyword-based classification
        if any(word in text_lower for word in ["lost", "found", "wallet", "phone", "keys", "bag", "item"]):
            return {
                "type": "LOST_FOUND",
                "title": text[:50],
                "description": text,
                "location": self._extract_simple_location(text),
                "date": None,
                "item_type": "lost" if "lost" in text_lower else "found",
                "department": None
            }
        elif any(word in text_lower for word in ["event", "workshop", "fest", "competition", "meeting", "seminar"]):
            return {
                "type": "EVENT",
                "title": text[:50],
                "description": text,
                "location": self._extract_simple_location(text),
                "date": self._extract_simple_date(text),
                "item_type": None,
                "department": None
            }
        else:
            return {
                "type": "ANNOUNCEMENT",
                "title": text[:50],
                "description": text,
                "location": self._extract_simple_location(text),
                "date": None,
                "item_type": None,
                "department": "General"
            }
    
    def _extract_simple_location(self, text: str) -> Optional[str]:
        """Simple location extraction"""
        common_locations = ["library", "cafeteria", "auditorium", "hall", "room", "lab", "ground"]
        text_lower = text.lower()
        
        for location in common_locations:
            if location in text_lower:
                # Try to extract the full location name
                words = text.split()
                for i, word in enumerate(words):
                    if location in word.lower():
                        # Get surrounding words for context
                        start = max(0, i-2)
                        end = min(len(words), i+3)
                        return " ".join(words[start:end])
        
        return None
    
    def _extract_simple_date(self, text: str) -> Optional[str]:
        """Simple date extraction"""
        import re
        
        # Look for common date patterns
        date_patterns = [
            r'\d{1,2}\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)',
            r'(today|tomorrow|yesterday)',
            r'\d{1,2}:\d{2}\s*(am|pm)',
            r'at\s+\d{1,2}\s*(am|pm)'
        ]
        
        for pattern in date_patterns:
            match = re.search(pattern, text.lower())
            if match:
                return match.group(0)
        
        return None


class OpenAIProvider(BaseLLMProvider):
    """OpenAI provider using LangChain"""
    
    def _get_llm(self):
        return ChatOpenAI(
            model=settings.OPENAI_MODEL,
            api_key=settings.OPENAI_API_KEY,
            temperature=settings.TEMPERATURE,
            max_tokens=settings.MAX_TOKENS
        )


class GeminiProvider(BaseLLMProvider):
    """Google Gemini provider using LangChain"""
    
    def _get_llm(self):
        print(f"🔑 Using Gemini API Key: {settings.GEMINI_API_KEY[:10]}..." if settings.GEMINI_API_KEY else "❌ No Gemini API Key found!")
        return ChatGoogleGenerativeAI(
            model=settings.GEMINI_MODEL,
            google_api_key=settings.GEMINI_API_KEY,
            temperature=settings.TEMPERATURE,
            max_output_tokens=settings.MAX_TOKENS,
            # Ensure the API key is properly set
            convert_system_message_to_human=True
        )


class OpenRouterProvider(BaseLLMProvider):
    """OpenRouter provider using LangChain with OpenAI-compatible interface"""
    
    def _get_llm(self):
        print(f"🔑 Using OpenRouter API Key: {settings.OPENROUTER_API_KEY[:10]}..." if settings.OPENROUTER_API_KEY else "❌ No OpenRouter API Key found!")
        return ChatOpenAI(
            model=settings.OPENROUTER_MODEL,
            api_key=settings.OPENROUTER_API_KEY,
            base_url="https://openrouter.ai/api/v1",
            temperature=settings.TEMPERATURE,
            max_tokens=settings.MAX_TOKENS,
            # OpenRouter specific headers
            default_headers={
                "HTTP-Referer": "http://localhost:3000",  # Your site URL
                "X-Title": "Campus Feed App"  # Your app name
            }
        )
    
    async def classify_text(self, text: str) -> Dict[str, Any]:
        """Classify text using OpenRouter with enhanced error handling"""
        try:
            llm = self._get_llm()
            chain = self.prompt_template | llm | self.parser
            
            print(f"🔗 OpenRouter processing: {text[:50]}...")
            
            result = await chain.ainvoke({"text": text})
            
            print(f"✅ OpenRouter result: {result}")
            
            # Validate the result has all required fields
            required_fields = ["type", "title", "description"]
            if not all(field in result for field in required_fields):
                print("⚠️  OpenRouter result missing required fields, using fallback")
                return self._fallback_classification(text)
            
            return result
            
        except OutputParserException as e:
            print(f"⚠️  OpenRouter JSON parsing failed, trying fallback: {e}")
            return self._fallback_parse(str(e), text)
            
        except Exception as e:
            print(f"❌ OpenRouter LLM error: {e}")
            return self._fallback_classification(text)


class AIService:
    """Main AI service managing multiple LLM providers"""
    
    def __init__(self):
        self.providers = {
            "openai": OpenAIProvider(),
            "gemini": GeminiProvider(),
            "openrouter": OpenRouterProvider()
        }
    
    async def classify_text(self, text: str, provider: str = "openrouter") -> ClassifyResponse:
        """Classify text using specified LLM provider"""
        print(f"🔍 Attempting classification with {provider}")
        
        # Use specified provider or fallback to openrouter
        if provider not in self.providers:
            print(f"⚠️  Unknown provider {provider}, defaulting to openrouter")
            provider = "openrouter"
        
        try:
            result = await self.providers[provider].classify_text(text)
            print(f"✅ {provider} classification successful: {result}")
            return ClassifyResponse(**result)
            
        except Exception as e:
            print(f"❌ AI API error ({provider}): {e}")
            
            # Intelligent fallback: Skip OpenAI if it has invalid key, prioritize Gemini
            if provider == "openrouter":
                # Try Gemini first since it's working well
                try:
                    print(f"🔄 OpenRouter failed, trying Gemini...")
                    result = await self.providers["gemini"].classify_text(text)
                    print(f"✅ Gemini fallback successful: {result}")
                    return ClassifyResponse(**result)
                except Exception as e2:
                    print(f"❌ Gemini fallback also failed: {e2}")
            elif provider == "gemini":
                # Try OpenRouter as fallback for Gemini
                try:
                    print(f"🔄 Gemini failed, trying OpenRouter...")
                    result = await self.providers["openrouter"].classify_text(text)
                    print(f"✅ OpenRouter fallback successful: {result}")
                    return ClassifyResponse(**result)
                except Exception as e2:
                    print(f"❌ OpenRouter fallback also failed: {e2}")
            
            # Skip OpenAI since it has invalid key - go straight to manual fallback
            print("🆘 Using enhanced manual fallback classification")
            fallback_result = self._enhanced_fallback_classification(text)
            return ClassifyResponse(**fallback_result)
    
    def _enhanced_fallback_classification(self, text: str) -> Dict[str, Any]:
        """Enhanced manual fallback classification with better extraction"""
        text_lower = text.lower()
        
        # Enhanced location extraction
        def extract_location(text: str) -> Optional[str]:
            import re
            # Look for specific location patterns
            location_patterns = [
                r'(cv raman hall|raman hall)',
                r'(main auditorium|auditorium)',
                r'(central library|library)',
                r'(student cafeteria|cafeteria)',
                r'(computer lab|lab \d+)',
                r'(hostel \w+|hostel)',
                r'(academic block|admin block)',
                r'(playground|ground)',
                r'(seminar hall|conference room)'
            ]
            
            for pattern in location_patterns:
                match = re.search(pattern, text.lower())
                if match:
                    return match.group(1)
            return None
        
        # Enhanced date extraction
        def extract_date(text: str) -> Optional[str]:
            import re
            date_patterns = [
                r'(\d{1,2}\s+aug\s+at\s+\d{1,2}\s+pm)',
                r'(\d{1,2}\s+aug)',
                r'(yesterday\s+evening)',
                r'(tomorrow\s+\w+)',
                r'(today\s+at\s+\d{1,2}:\d{2})',
                r'(at\s+\d{1,2}\s+pm)',
                r'(\d{1,2}:\d{2}\s*(am|pm))'
            ]
            
            for pattern in date_patterns:
                match = re.search(pattern, text.lower())
                if match:
                    return match.group(1)
            return None
        
        # Enhanced item type extraction for lost/found
        def extract_item_type(text: str) -> Optional[str]:
            import re
            item_patterns = [
                r'(iphone \d+|iphone)',
                r'(laptop|computer)',
                r'(wallet|purse)',
                r'(keys|car keys)',
                r'(phone|mobile)',
                r'(bag|backpack)',
                r'(watch|smart watch)',
                r'(earphones|headphones)'
            ]
            
            for pattern in item_patterns:
                match = re.search(pattern, text.lower())
                if match:
                    return match.group(1)
            return None
        
        # Extract enhanced details
        location = extract_location(text)
        date = extract_date(text)
        
        # Classification logic with enhanced extraction
        if any(word in text_lower for word in ["lost", "found", "wallet", "phone", "keys", "bag", "item", "laptop"]):
            item_type = extract_item_type(text)
            return {
                "type": "LOST_FOUND",
                "title": f"{'Lost' if 'lost' in text_lower else 'Found'} {item_type or 'Item'}",
                "description": text,
                "location": location,
                "date": date,
                "item_type": item_type or ("lost" if "lost" in text_lower else "found"),
                "department": None
            }
        elif any(word in text_lower for word in ["event", "workshop", "fest", "competition", "meeting", "seminar", "racing"]):
            return {
                "type": "EVENT",
                "title": text[:50],
                "description": text,
                "location": location,
                "date": date,
                "item_type": None,
                "department": None
            }
        else:
            return {
                "type": "ANNOUNCEMENT",
                "title": text[:50],
                "description": text,
                "location": location,
                "date": date,
                "item_type": None,
                "department": "General"
            }


# Global AI service instance
ai_service = AIService()
