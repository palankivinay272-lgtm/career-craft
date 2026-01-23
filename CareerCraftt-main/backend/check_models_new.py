import os
from google import genai
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("❌ No API Key found in .env")
    exit(1)

print(f"🔑 Using API Key: {api_key[:5]}... (Length: {len(api_key)})")

client = genai.Client(api_key=api_key)

print("🔄 Listing available models...")
try:
    for m in client.models.list_models():
        print(f" - {m.name} (Supported: {m.supported_generation_methods})")
except Exception as e:
    print(f"❌ Failed to list models: {e}")
