from firebase_config import firebase_client

def migrate_malla_reddy():
    db = firebase_client.db
    if not db:
        print("❌ Firestore not initialized.")
        return

    print("🚀 Migrating Malla Reddy college names...")
    users_ref = db.collection("users")
    docs = users_ref.stream()
    
    count = 0
    for doc in docs:
        data = doc.to_dict()
        old_college = data.get("college")
        
        # Variations to catch
        target_variations = [
            "Malla Reddy College of Engineering",
            "Malla Reddy",
            "MallaReddy",
            "Malla Reddy College"
        ]
        
        if old_college in target_variations:
            new_college = "Mallareddy Engineering College"
            db.collection("users").document(doc.id).update({
                "college": new_college
            })
            print(f"✅ Updated user {data.get('email', doc.id)}: {old_college} -> {new_college}")
            count += 1
            
    print(f"🎉 Migration complete. Updated {count} users.")

if __name__ == "__main__":
    migrate_malla_reddy()
