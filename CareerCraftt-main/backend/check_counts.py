import sys
import os

# Ensure backend dir is in path
sys.path.append(os.getcwd())

from firebase_config import firebase_client
from google.cloud import firestore

def check_counts():
    print("Checking Firestore Counts...")
    if not firebase_client.db:
        print("❌ DB not initialized")
        return

    try:
        # Get all interview questions
        docs = firebase_client.db.collection("interview_questions").stream()
        count = 0
        domains = set()
        for doc in docs:
            count += 1
            data = doc.to_dict()
            domains.add(data.get('domain'))
            
        with open("counts_log.txt", "w") as f:
            f.write(f"Total Questions: {count}\n")
            f.write(f"Domains Found: {domains}\n")
            
    except Exception as e:
        with open("counts_log.txt", "w") as f:
            f.write(f"Error: {e}")

if __name__ == "__main__":
    check_counts()
