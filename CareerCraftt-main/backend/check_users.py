import sys
import os

# Ensure backend dir is in path
sys.path.append(os.getcwd())

from firebase_config import firebase_client
from google.cloud import firestore

def check_users():
    print("Checking Users Collection...")
    if not firebase_client.db:
        print("❌ DB not initialized")
        return

    try:
        docs = firebase_client.db.collection("users").stream()
        count = 0
        
        with open("user_check_log.txt", "w") as f:
            f.write("--- USERS REPORT ---\n")
            for doc in docs:
                count += 1
                data = doc.to_dict()
                uid = doc.id
                email = data.get("email", "No Email")
                resume = data.get("resume_text", "")
                resume_len = len(resume) if resume else 0
                
                f.write(f"UID: {uid}\n")
                f.write(f"  Email: {email}\n")
                f.write(f"  Resume Length: {resume_len}\n")
                f.write("-" * 20 + "\n")
            
            f.write(f"Total Users: {count}\n")
            print(f"✅ Checked {count} users. See user_check_log.txt")
            
    except Exception as e:
        print(f"Error: {e}")
        with open("user_check_log.txt", "w") as f:
            f.write(f"Error: {e}")

if __name__ == "__main__":
    check_users()
