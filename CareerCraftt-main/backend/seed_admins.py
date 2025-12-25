from firebase_config import firebase_client
from firebase_admin import firestore

def seed_admins():
    db = firebase_client.db
    if not db:
        print("❌ Firestore not initialized. Check serviceAccountKey.json")
        return

    admins = [
        {"username": "admin_iitb", "password": "password123", "college": "IIT Bombay"},
        {"username": "admin_iitd", "password": "password123", "college": "IIT Delhi"},
        {"username": "admin_nitw", "password": "password123", "college": "NIT Warangal"},
        {"username": "admin_abc", "password": "password123", "college": "ABC College"},
        {"username": "admin_xyz", "password": "password123", "college": "XYZ University"},
    ]

    print("🚀 Seeding Placement Officers...")
    batch = db.batch()
    
    for admin in admins:
        # Document ID is the username for easy lookup
        doc_ref = db.collection("placement_officers").document(admin["username"])
        batch.set(doc_ref, admin)
        print(f"🔹 Prepared: {admin['username']} -> {admin['college']}")

    batch.commit()
    print("✅ Successfully seeded placement officers!")

if __name__ == "__main__":
    seed_admins()
