from firebase_config import firebase_client
from firebase_admin import firestore

def seed_admins():
    db = firebase_client.db
    if not db:
        print("❌ Firestore not initialized. Check serviceAccountKey.json")
        return

    admins = [
        {"username": "admin_iitb", "password": "password123", "college": "IIT Bombay"},
        {"username": "admin_anurag", "password": "password123", "college": "Anurag University"},
        {"username": "admin_vnrvjiet", "password": "password123", "college": "VNR Vignana Jyothi Institute of Engineering and Technology"},
        {"username": "admin_bits", "password": "password123", "college": "BITS Pilani, Hyderabad Campus"},
        {"username": "admin_cbit", "password": "password123", "college": "Chaitanya Bharathi Institute of Technology (CBIT)"},
        {"username": "admin_mallareddy", "password": "password123", "college": "Mallareddy Engineering College"},
        {"username": "admin_iith", "password": "password123", "college": "IIT Hyderabad"},
        {"username": "admin_iiith", "password": "password123", "college": "IIIT Hyderabad"},
        {"username": "admin_nitw", "password": "password123", "college": "NIT Warangal"},
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
