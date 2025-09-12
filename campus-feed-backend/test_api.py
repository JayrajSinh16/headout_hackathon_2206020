import requests
import sys
import os

# Add the app directory to the path for importing
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

# Test the modular backend API endpoints
BASE_URL = "http://localhost:8000"

def test_api():
    print("🧪 Testing Campus Feed API (Modular Structure)...")
    
    # Test 1: Root endpoint
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"✅ Root endpoint: {response.json()}")
    except Exception as e:
        print(f"❌ Root endpoint failed: {e}")
        return
    
    # Test 2: Classification with OpenAI
    test_text = "Lost my wallet near the library"
    try:
        response = requests.post(f"{BASE_URL}/api/classify", 
                               json={"text": test_text, "ai_provider": "openai"})
        if response.status_code == 200:
            print(f"✅ OpenAI Classification endpoint working")
            classification = response.json()
            print(f"   Type: {classification['type']}")
            print(f"   Title: {classification['title']}")
        else:
            print(f"⚠️  OpenAI Classification endpoint returned {response.status_code}")
    except Exception as e:
        print(f"❌ OpenAI Classification endpoint failed: {e}")
    
    # Test 3: Classification with Gemini
    try:
        response = requests.post(f"{BASE_URL}/api/classify", 
                               json={"text": test_text, "ai_provider": "gemini"})
        if response.status_code == 200:
            print(f"✅ Gemini Classification endpoint working")
            classification = response.json()
            print(f"   Type: {classification['type']}")
            print(f"   Title: {classification['title']}")
        else:
            print(f"⚠️  Gemini Classification endpoint returned {response.status_code}")
    except Exception as e:
        print(f"❌ Gemini Classification endpoint failed: {e}")
    
    # Test 4: Create a test post
    test_post = {
        "type": "ANNOUNCEMENT",
        "title": "Test Post from Modular API",
        "description": "This is a test post from the new modular structure",
        "department": "IT",
        "user_id": "test_user"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/posts", json=test_post)
        if response.status_code == 200:
            print(f"✅ Post creation working")
            post_id = response.json().get("id")
        else:
            print(f"⚠️  Post creation returned {response.status_code}")
    except Exception as e:
        print(f"❌ Post creation failed: {e}")
    
    # Test 5: Get posts
    try:
        response = requests.get(f"{BASE_URL}/api/posts")
        if response.status_code == 200:
            posts = response.json()
            print(f"✅ Get posts working - Found {len(posts)} posts")
        else:
            print(f"⚠️  Get posts returned {response.status_code}")
    except Exception as e:
        print(f"❌ Get posts failed: {e}")
    
    print("\n🎉 Modular API testing complete!")
    print("📁 New file structure:")
    print("   app/")
    print("   ├── core/         # Configuration")
    print("   ├── models/       # Pydantic schemas")
    print("   ├── services/     # Business logic")
    print("   ├── storage/      # Data storage")
    print("   ├── api/          # API routes")
    print("   └── main.py       # App factory")

if __name__ == "__main__":
    test_api()
