
import firebase_admin
from firebase_admin import credentials, firestore
import os

def test_connection():
    print("--- Firebase Connection Test ---")
    key_path = "serviceAccountKey.json"
    
    if not os.path.exists(key_path):
        print(f"❌ ERROR: '{key_path}' not found in current directory.")
        return

    try:
        # 1. Initialize
        print(f"1. Loading '{key_path}'...")
        cred = credentials.Certificate(key_path)
        
        # Check if app already exists to avoid error
        if not firebase_admin._apps:
            firebase_admin.initialize_app(cred)
        
        print("✅ Credentials loaded.")

        # 2. Test Firestore
        print("2. Attempting to talk to Google servers...")
        db = firestore.client()
        
        # Just fetch collections limit 1 to see if auth works
        # This triggers the actual network call that fails with JWT error
        cols = list(db.collections(limit=1)) 
        
        print("✅ SUCCESS! Connected to Firebase. The key is valid.")
        
    except Exception as e:
        print("\n❌ CONNECTION FAILED")
        print(f"   Error details: {e}")
        print("\n   DIAGNOSIS:")
        if "Invalid JWT Signature" in str(e):
            print("   >>> THE KEY IS CORRUPTED <<<")
            print("   The file structure looks okay, but the random characters inside the 'private_key'")
            print("   are wrong (maybe characters were deleted or changed).")
            print("   You CANNOT fix this file. You MUST generate a new one.")

if __name__ == "__main__":
    test_connection()
