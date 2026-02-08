from firebase_config import firebase_client

def fix_user(email, canonical_name):
    db = firebase_client.db
    if not db:
        print("❌ Firestore not initialized")
        return

    users = db.collection("users").where("email", "==", email).stream()
    for user in users:
        db.collection("users").document(user.id).update({"college": canonical_name})
        print(f"✅ Updated {email} college to '{canonical_name}'")

if __name__ == "__main__":
    fix_user("tejaa@gmail.com", "National Institute of Technology (NIT) Trichy")
