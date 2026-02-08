from firebase_config import firebase_client
from firebase_admin import firestore

def check_db():
    db = firebase_client.db
    if not db:
        print("❌ Firestore not initialized.")
        return
    print("✅ Firestore initialized.")
    try:
        # Try a simple read
        doc = db.collection("placement_officers").limit(1).get()
        print(f"✅ Firestore read successful. Found {len(list(doc))} documents.")
    except Exception as e:
        print(f"❌ Firestore read failed: {e}")

if __name__ == "__main__":
    check_db()
