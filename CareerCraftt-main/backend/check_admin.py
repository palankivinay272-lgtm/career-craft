from firebase_config import firebase_client

def check_admin():
    db = firebase_client.db
    if not db:
        print("❌ Firestore not initialized")
        return

    doc_ref = db.collection("placement_officers").document("admin_iitb")
    doc = doc_ref.get()
    
    if doc.exists:
        print(f"✅ Found admin_iitb: {doc.to_dict()}")
    else:
        print("❌ admin_iitb NOT FOUND in Firestore")

if __name__ == "__main__":
    check_admin()
