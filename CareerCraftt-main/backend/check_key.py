import json
import os
import sys

def check_key():
    print("--- CareerCraft Key Validator ---")
    file_path = "serviceAccountKey.json"
    
    if not os.path.exists(file_path):
        print(f"❌ ERROR: '{file_path}' not found in the current folder.")
        print("   Make sure you put the file in the 'backend' folder.")
        return

    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
            data = json.loads(content)
    except json.JSONDecodeError as e:
        print(f"❌ ERROR: The file is not valid JSON.")
        print(f"   Details: {e}")
        return

    private_key = data.get("private_key")
    if not private_key:
        print("❌ ERROR: 'private_key' field is missing from the JSON.")
        return

    print(f"ℹ️  Key length: {len(private_key)} characters")
    
    # Check 1: Header/Footer
    if "-----BEGIN PRIVATE KEY-----" not in private_key:
        print("❌ ERROR: Key is missing '-----BEGIN PRIVATE KEY-----'.")
    elif "-----END PRIVATE KEY-----" not in private_key:
        print("❌ ERROR: Key is missing '-----END PRIVATE KEY-----'.")
    else:
        print("✅ Header and Footer present.")

    # Check 2: Newlines
    if "\\n" in private_key:
        print("⚠️  WARNING: Found literal '\\n' characters (backslash + n).")
        print("   This often happens if you copied the key from a raw string view.")
        print("   The Google Auth library might handle this, but it's risky.")
        # Attempt to fix for verification
        fixed_key = private_key.replace("\\n", "\n")
    else:
        fixed_key = private_key

    newline_count = fixed_key.count("\n")
    print(f"ℹ️  Newline count: {newline_count}")

    if newline_count < 5:
        print("❌ ERROR: The private key has very few newlines.")
        print("   It looks like it was flattened into a single line.")
        print("   SOLUTION: Open the file and ensure the private key has real line breaks,")
        print("   OR replace the file with a fresh download from Firebase.")
    else:
        print("✅ Newline count looks correct.")

    print("\n--- Summary ---")
    print("If you see errors above, the easiest fix is to DELETE this file")
    print("and copy a FRESH 'serviceAccountKey.json' from the original source")
    print("(do not copy-paste the text content, send the file itself).")

if __name__ == "__main__":
    check_key()
