
import firebase_admin
from firebase_admin import credentials, firestore

try:
    from firebase_config import firebase_client
    db = firebase_client.db
except:
    if not firebase_admin._apps:
        cred = credentials.Certificate("serviceAccountKey.json")
        firebase_admin.initialize_app(cred)
    db = firestore.client()

def inspect_and_clear():
    if not db:
        print("DB Not connected")
        return

    print("Fetching jobs from Firestore...")
    docs = db.collection("jobs").stream()
    
    count = 0
    batch = db.batch()
    
    for doc in docs:
        data = doc.to_dict()
        print(f"FOUND JOB [{doc.id}]: {data.get('role')} at {data.get('company')}")
        batch.delete(doc.reference)
        count += 1
        
    if count == 0:
        print("No jobs found in Firestore.")
    else:
        print(f"Deleting {count} jobs...")
        batch.commit()
        print("Deletion complete.")

if __name__ == "__main__":
    inspect_and_clear()
