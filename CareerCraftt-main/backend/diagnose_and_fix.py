import sys
import subprocess
import os

print(f"🐍 Python Executable: {sys.executable}")
print(f"📂 CWD: {os.getcwd()}")

# 1. Force Install Dependencies
deps = ["python-docx", "pypdf", "google-genai", "python-multipart"]
print(f"\n📦 Installing dependencies: {', '.join(deps)}...")
try:
    subprocess.check_call([sys.executable, "-m", "pip", "install"] + deps)
    print("✅ Dependencies installed successfully.")
except Exception as e:
    print(f"❌ Dependency installation failed: {e}")

# 2. Verify Imports
print("\n🔍 Verifying Imports...")
try:
    import docx
    print(f"✅ docx imported (Version: {getattr(docx, '__version__', 'unknown')})")
except ImportError as e:
    print(f"❌ docx import failed: {e}")

try:
    from google import genai
    print("✅ google.genai imported")
except ImportError as e:
    print(f"❌ google.genai import failed: {e}")

# 3. Test Gemini Models
print("\n🤖 Testing Gemini Models...")
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    # Try .env
    try:
        with open(".env", "r") as f:
            for line in f:
                if line.startswith("GEMINI_API_KEY="):
                    api_key = line.strip().split("=", 1)[1]
                    break
    except:
        pass

if not api_key:
    print("❌ NO GEMINI_API_KEY FOUND")
else:
    print(f"🔑 API Key found: {api_key[:5]}...{api_key[-5:]}")
    client = genai.Client(api_key=api_key)
    
    models_to_test = [
        "gemini-1.5-flash",
        "gemini-1.5-flash-001",
        "gemini-1.5-flash-002",
        "gemini-1.5-pro",
        "gemini-1.5-pro-001",
        "gemini-1.5-pro-002",
        "gemini-2.0-flash-exp",
        "gemini-pro",
        "models/gemini-1.5-flash", 
        "gemini-1.0-pro"
    ]
    
    working_model = None
    
    for m in models_to_test:
        print(f"   Testing '{m}'...", end=" ")
        try:
            response = client.models.generate_content(
                model=m,
                contents="Hi"
            )
            print("✅ WORKING!")
            working_model = m
            break # Stop at first working one
        except Exception as e:
            err_str = str(e)
            if "404" in err_str:
                print("❌ 404 Not Found")
            elif "429" in err_str:
                print("⚠️ 429 Quota Exceeded (Model exists!)")
                if not working_model: working_model = m # Accept as fallback if no others work
            else:
                print(f"❌ Error: {err_str[:50]}...")

    if working_model:
        print(f"\n🏆 Recommended Model: {working_model}")
    else:
        print("\n💀 No working models found.")
