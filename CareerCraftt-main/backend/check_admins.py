from firebase_config import firebase_client
import sys

def check_admins():
    with open("admin_debug.txt", "w", encoding="utf-8") as f:
        db = firebase_client.db
        if not db:
            f.write("❌ Firestore not initialized\n")
            return

        f.write("🔍 Searching for placement_officers...\n")
        docs = db.collection("placement_officers").stream()
        found = False
        for doc in docs:
            f.write(f"✅ Found Admin: {doc.id} -> {doc.to_dict()}\n")
            found = True
        
        if not found:
            f.write("❌ No placement officers found in Firestore\n")

if __name__ == "__main__":
    check_admins()
