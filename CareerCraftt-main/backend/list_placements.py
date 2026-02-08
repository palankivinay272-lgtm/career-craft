from firebase_config import firebase_client

def list_placements():
    db = firebase_client.db
    if not db:
        print("❌ Firestore not initialized")
        return

    docs = db.collection("placements").stream()
    print("--- Placements Documents Found ---")
    for doc in docs:
        print(f"- {doc.id}")

if __name__ == "__main__":
    list_placements()
