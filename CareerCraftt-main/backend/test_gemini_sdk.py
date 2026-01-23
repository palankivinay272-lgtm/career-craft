import os
from google import genai
from google.genai import types

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    # Try loading from .env manually
    try:
        with open(".env", "r") as f:
            for line in f:
                if line.startswith("GEMINI_API_KEY="):
                    api_key = line.strip().split("=", 1)[1]
                    break
    except:
        pass

if not api_key:
    print("NO API KEY FOUND")
    exit()

print(f"Using API Key: {api_key[:5]}...{api_key[-5:]}")

client = genai.Client(api_key=api_key)

try:
    print("Listing models via new SDK...")
    # The new SDK doesn't have a simple 'list_models' in the same way, 
    # lets try to generate content with a few known models to see which one works.
    
    test_models = [
        "gemini-1.5-flash", 
        "gemini-1.5-pro", 
        "gemini-2.0-flash-exp", 
        "gemini-pro",
        "gemini-1.0-pro"
    ]
    
    for m in test_models:
        print(f"\nTesting {m}...")
        try:
            response = client.models.generate_content(
                model=m,
                contents="Hello, are you there?",
            )
            print(f"✅ {m} IS WORKING!")
        except Exception as e:
            print(f"❌ {m} Failed: {e}")

except Exception as e:
    print(f"Fatal Error: {e}")
