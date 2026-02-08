from firebase_config import firebase_client

def fix_teja():
    db = firebase_client.db
    if not db:
        print("❌ Firestore not initialized.")
        return

    # From previous logs, UID is mcv4NQz049NFzg2nK3Rmsg4DXWk1
    uid = "mcv4NQz049NFzg2nK3Rmsg4DXWk1"
    
    print(f"🔧 Fixing user {uid}...")
    
    user_ref = db.collection("users").document(uid)
    user_ref.update({
        "college": "Mallareddy Engineering College"
    })
    
    print("✅ updated college to Mallareddy Engineering College")

if __name__ == "__main__":
    fix_teja()
