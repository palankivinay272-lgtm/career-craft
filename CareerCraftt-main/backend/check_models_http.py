import os
import requests
import json

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    # Try reading .env manually
    try:
        with open(".env", "r") as f:
            for line in f:
                if line.strip() and not line.startswith("#"):
                    parts = line.strip().split("=", 1)
                    if len(parts) == 2 and parts[0] == "GEMINI_API_KEY":
                        api_key = parts[1]
                        break
    except:
        pass

if not api_key:
    print("NO API KEY FOUND")
    exit()

url = f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key}"
try:
    print(f"Requesting: {url.replace(api_key, 'HIDDEN')}")
    response = requests.get(url)
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        models = response.json().get('models', [])
        print("Available Models:")
        for m in models:
            print(f"- {m['name']}")
            print(f"  Methods: {m.get('supportedGenerationMethods', [])}")
    else:
        print(f"Error: {response.text}")
except Exception as e:
    print(f"Exception: {e}")
