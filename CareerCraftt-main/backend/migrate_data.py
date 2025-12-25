from firebase_config import firebase_client 
from firebase_admin import firestore
import main

def migrate_jobs():
    db = firebase_client.db
    if not db:
        print("❌ Firestore not initialized")
        return

    batch = db.batch()
    
    print("🚀 Migrating Jobs...")
    for job in main.JOBS_DB:
        # Create a document reference
        doc_ref = db.collection("jobs").document() 
        batch.set(doc_ref, job)
    
    batch.commit()
    print(f"✅ Migrated {len(main.JOBS_DB)} jobs.")

def migrate_placements():
    db = firebase_client.db
    if not db:
        print("❌ Firestore not initialized")
        return

    batch = db.batch()
    
    print("🚀 Migrating Placements...")
    # PLACEMENTS_DB is dict: { "CollegeName": [ {company:..., totalHires:...}, ... ] }
    # We will store each college as a document in "placements" collection, 
    # and the list of companies as a field 'data' or subcollection.
    # Simpler approach: Document ID = College Name, Field = companies list.
    
    for college, companies in main.PLACEMENTS_DB.items():
        doc_ref = db.collection("placements").document(college)
        batch.set(doc_ref, {"companies": companies})
        
    batch.commit()
    print(f"✅ Migrated placements for {len(main.PLACEMENTS_DB)} colleges.")

if __name__ == "__main__":
    migrate_jobs()
    migrate_placements()
