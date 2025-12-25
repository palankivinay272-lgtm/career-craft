import sys
import os

sys.path.append(os.getcwd())

try:
    import seed_questions
    print("Attempting to seed...")
    seed_questions.seed_questions()
    print("✅ Seed function executed.")
except Exception as e:
    print(f"❌ Error during seeding: {e}")
    import traceback
    traceback.print_exc()
