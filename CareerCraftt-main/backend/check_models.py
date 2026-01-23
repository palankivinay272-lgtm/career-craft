import google.generativeai as genai
import os

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    # Try reading .env manually
    try:
        with open(".env", "r") as f:
            for line in f:
                if line.strip() and not line.startswith("#"):
                    key, value = line.strip().split("=", 1)
                    if key == "GEMINI_API_KEY":
                        api_key = value
                        break
    except:
        pass

if not api_key:
    print("NO API KEY FOUND")
    exit()

genai.configure(api_key=api_key)
print("Available Models:")
try:
    for m in genai.list_models():
        print(f"- {m.name}")
except Exception as e:
    print(f"Error: {e}")
