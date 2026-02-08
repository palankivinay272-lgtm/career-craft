from firebase_config import firebase_client

def check_user():
    db = firebase_client.db
    if not db:
        print("❌ Firestore not initialized.")
        return

    email = "teja67@gmail.com"
    print(f"🔍 Searching for user with email: {email}")
    
    users_ref = db.collection("users")
    # Query by email since we might not know the UID easily, or scan all if needed.
    # But usually users are keyed by UID. Let's search by email field.
    query = users_ref.where("email", "==", email).stream()
    
    found = False
    for doc in query:
        found = True
        data = doc.to_dict()
        print(f"📄 User Found: {doc.id}")
        print(f"   Name: {data.get('displayName', 'N/A')}")
        print(f"   College: {data.get('college')}")
        print(f"   UID: {data.get('uid')}")
        
    if not found:
        print("❌ User not found by email query.")

if __name__ == "__main__":
    check_user()
