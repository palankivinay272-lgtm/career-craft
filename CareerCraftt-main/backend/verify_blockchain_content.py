import sys
import os
sys.path.append(os.getcwd())
from firebase_config import firebase_client
import firebase_admin

def check():
    try:
        # DB init happened on import of firebase_config
        if not firebase_client.db:
            print("DB not initialized")
            return

        docs = firebase_client.db.collection("interview_questions").where("domain", "==", "Blockchain").stream()
        count = 0
        for _ in docs:
            count += 1
            
        print(f"Blockchain Questions Found: {count}")
        with open("verify_result.txt", "w", encoding="utf-8") as f:
             f.write(f"Blockchain Questions: {count}")
             
    except Exception as e:
        print(f"Error: {e}")
        with open("verify_result.txt", "w", encoding="utf-8") as f:
             f.write(f"Error: {e}")

if __name__ == "__main__":
    check()
