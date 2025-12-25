import sys
import os

# Ensure backend dir is in path
sys.path.append(os.getcwd())

from firebase_config import firebase_client

def test_questions():
    print("Testing Firestore Connection...")
    if not firebase_client.db:
        print("❌ DB not initialized")
        return

    print("Fetching questions for Web Development / easy...")
    try:
        docs = firebase_client.db.collection("interview_questions")\
            .where("domain", "==", "Web Development")\
            .where("level", "==", "easy")\
            .stream()
        
        questions = [doc.to_dict() for doc in docs]
        print(f"✅ Found {len(questions)} questions!")
        if len(questions) > 0:
            print("Sample:", questions[0]['question'])
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_questions()
