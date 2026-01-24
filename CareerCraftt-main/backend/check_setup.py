import os
import sys

def check_setup():
    print("--- Checking Setup ---")
    
    # 1. Imports
    try:
        import pypdf
        print("✅ pypdf installed")
    except ImportError:
        print("❌ pypdf MISSING")
        
    try:
        from dotenv import load_dotenv
        print("✅ python-dotenv installed")
    except ImportError:
        print("❌ python-dotenv MISSING")

    # 2. Files
    if os.path.exists(".env"):
        print("✅ .env found")
    else:
        print("❌ .env MISSING")

    if os.path.exists("serviceAccountKey.json"):
        print("✅ serviceAccountKey.json found")
    else:
        print("❌ serviceAccountKey.json MISSING")

if __name__ == "__main__":
    check_setup()
