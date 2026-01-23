import os
import json
import urllib.request

# Minimal dotenv parser
def load_env():
    try:
        with open(".env", "r") as f:
            for line in f:
                if line.strip() and not line.startswith("#"):
                    parts = line.strip().split("=", 1)
                    if len(parts) == 2:
                        os.environ[parts[0]] = parts[1]
    except:
        pass

load_env()
key = os.getenv("GEMINI_API_KEY")

if not key:
    print("No API Key found")
    exit(1)

print(f"Checking models with key: {key[:4]}...")

url = f"https://generativelanguage.googleapis.com/v1beta/models?key={key}"
try:
    with urllib.request.urlopen(url) as response:
        data = json.load(response)
        models = [m['name'] for m in data.get('models', [])]
        print("\n✅ AVAILABLE MODELS:")
        for m in models:
            print(f"- {m}")
except Exception as e:
    print(f"\n❌ API ERROR: {e}")
    # Try to read error body if possible
    if hasattr(e, 'read'):
        print(f"Details: {e.read().decode()}")
