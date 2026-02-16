import firebase_admin
from firebase_admin import credentials, auth, firestore
import os

# Initialize Firebase Admin
import json

# We expect serviceAccountKey.json to be in the same directory
cred_path = os.path.join(os.path.dirname(__file__), "serviceAccountKey.json")

# [DEPLOYMENT FIX] If on Render (or local without file), try to create it from ENV
if not os.path.exists(cred_path):
    firebase_creds = os.getenv("FIREBASE_CREDENTIALS")
    if firebase_creds:
        try:
            # Handle potential newlines in the env var if it was pasted weirdly
            if isinstance(firebase_creds, str) and not firebase_creds.startswith("{"):
                 # Sometimes base64 is used, but for now we assume raw JSON string
                 pass 
            
            with open(cred_path, "w") as f:
                f.write(firebase_creds)
            print(f"✅ Created serviceAccountKey.json from ENV")
        except Exception as e:
            print(f"❌ Failed to create key from ENV: {e}")


if os.path.exists(cred_path):
    try:
        with open("db_init.txt", "a", encoding="utf-8") as f:
            if not firebase_admin._apps:
                cred = credentials.Certificate(cred_path)
                firebase_admin.initialize_app(cred)
                f.write("✅ Firebase Admin Initialized\n")
            else:
                f.write("🔄 Firebase Admin Already Initialized\n")
    except Exception as e:
        with open("db_init.txt", "a", encoding="utf-8") as f:
            f.write(f"❌ Failed to initialize Firebase Admin: {e}\n")
else:
    with open("db_init.txt", "a", encoding="utf-8") as f:
        f.write("⚠️ serviceAccountKey.json not found. Using MOCK DATA for Database operations.\n")

class FirebaseClient:
    def __init__(self):
        self.db = firestore.client() if firebase_admin._apps else None

    def verify_token(self, token):
        if not firebase_admin._apps:
            return None
        try:
            decoded_token = auth.verify_id_token(token)
            return decoded_token
        except Exception as e:
            print(f"Token verification failed: {e}")
            return None

firebase_client = FirebaseClient()
