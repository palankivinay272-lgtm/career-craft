
import firebase_admin
from firebase_admin import credentials, firestore
import os

# Initialize Firebase (assuming creds are same as main app or env var)
# We can just import from firebase_config if available, but let's be standalone safe
try:
    from firebase_config import firebase_client
    db = firebase_client.db
except:
    if not firebase_admin._apps:
        cred = credentials.Certificate("serviceAccountKey.json")
        firebase_admin.initialize_app(cred)
    db = firestore.client()

def purge_jobs():
    if not db:
        print("Database not connected.")
        return

    jobs_ref = db.collection("jobs")
    docs = jobs_ref.stream()
    
    count = 0
    for doc in docs:
        print(f"Deleting job: {doc.id} => {doc.to_dict().get('role', 'Unknown')}")
        doc.reference.delete()
        count += 1
        
    print(f"Deleted {count} jobs. Database is clean.")

if __name__ == "__main__":
    purge_jobs()
