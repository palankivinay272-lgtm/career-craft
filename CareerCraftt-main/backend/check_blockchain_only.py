import sys
import os
sys.path.append(os.getcwd())
try:
    from firebase_config import firebase_client
    if not firebase_client.db:
        print("DB Not Init")
        exit()
    
    with open("blockchain_found.txt", "w") as f:
        docs = firebase_client.db.collection("interview_questions").where("domain", "==", "Blockchain").limit(5).stream()
        found = 0
        f.write("Checking...\n")
        for d in docs:
            found += 1
            f.write(f"Found: {d.to_dict().get('question')}\n")
        
        f.write(f"Total Blockchain Found: {found}\n")

except Exception as e:
    with open("blockchain_found.txt", "w") as f:
        f.write(f"Error: {e}")
