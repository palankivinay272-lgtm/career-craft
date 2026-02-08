from firebase_config import firebase_client

def check_user_college(email):
    db = firebase_client.db
    if not db:
        print("❌ Firestore not initialized")
        return

    users = db.collection("users").where("email", "==", email).stream()
    found = False
    for user in users:
        data = user.to_dict()
        print(f"✅ User {email} found: UID={user.id}, College={data.get('college')}")
        found = True
    
    if not found:
        print(f"❌ User {email} not found in Firestore")

if __name__ == "__main__":
    import sys
    email = sys.argv[1] if len(sys.argv) > 1 else "tejaa@gmail.com"
    check_user_college(email)
