import firebase_admin
from firebase_admin import credentials, firestore
import os
import sys

# Setup basics
current_dir = os.path.dirname(os.path.abspath(__file__))
cred_path = os.path.join(current_dir, "serviceAccountKey.json")

if not os.path.exists(cred_path):
    print("❌ serviceAccountKey.json not found in backend directory.")
    sys.exit(1)

# Initialize
try:
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)
    db = firestore.client()
    print("✅ Firebase initialized.")
except Exception as e:
    print(f"❌ Failed to init Firebase: {e}")
    sys.exit(1)

# Admin Data
admin_id = "admin_iitb"
data = {
    "password": "iitb@123",
    "college": "IIT Bombay"
}

# Write to DB
try:
    # Using 'placement_officers' collection as defined in main.py logic
    db.collection("placement_officers").document(admin_id).set(data)
    print(f"✅ Successfully created admin user: {admin_id}")
    print(f"   Password: {data['password']}")
    print(f"   College:  {data['college']}")
except Exception as e:
    print(f"❌ Error writing to DB: {e}")
