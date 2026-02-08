from firebase_config import firebase_client

def check_all_users():
    with open("user_colleges.txt", "w", encoding="utf-8") as f:
        db = firebase_client.db
        if not db:
            f.write("❌ Firestore not initialized\n")
            return

        f.write("🔍 Listing users and their colleges...\n")
        users = db.collection("users").stream()
        found = False
        for user in users:
            data = user.to_dict()
            email = data.get("email", "N/A")
            college = data.get("college", "NOT SET")
            f.write(f"👤 {email} -> {college} (UID: {user.id})\n")
            found = True
        
        if not found:
            f.write("❌ No users found in Firestore\n")

if __name__ == "__main__":
    check_all_users()
