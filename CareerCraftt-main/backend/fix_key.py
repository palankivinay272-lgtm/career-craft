
import json
import os

def fix_key():
    print("--- Service Account Key Fixer ---")
    input_file = "serviceAccountKey.json"
    output_file = "serviceAccountKey_fixed.json"

    if not os.path.exists(input_file):
        print(f"❌ '{input_file}' not found.")
        print("   Please make sure you are running this script in the 'backend' folder")
        print("   and that your bad key file is named 'serviceAccountKey.json'.")
        return

    try:
        with open(input_file, "r", encoding="utf-8") as f:
            content = f.read()
            # Try parsing
            data = json.loads(content)
    except json.JSONDecodeError as e:
        print(f"❌ The file is not valid JSON. Please download a fresh key from Firebase.")
        print(f"   Error: {e}")
        return

    private_key = data.get("private_key")
    if not private_key:
        print("❌ 'private_key' field is missing.")
        return

    # THE FIX LOGIC
    # 1. Check if it contains literal "\n" (backslash n) which breaks JWT signing
    if "\\n" in private_key:
        print("⚠️  Found literal '\\n' characters. Fixing...")
        fixed_private_key = private_key.replace("\\n", "\n")
        data["private_key"] = fixed_private_key
        print("✅ Replaced literal newlines with actual line breaks.")
    else:
        print("ℹ️  No literal '\\n' found. Checking deeper...")
        fixed_private_key = private_key

    # 2. Check header/footer
    if "-----BEGIN PRIVATE KEY-----" not in fixed_private_key:
        print("⚠️  Missing BEGIN header. Attempting to add...")
        fixed_private_key = "-----BEGIN PRIVATE KEY-----\n" + fixed_private_key
    
    if "-----END PRIVATE KEY-----" not in fixed_private_key:
        print("⚠️  Missing END header. Attempting to add...")
        fixed_private_key = fixed_private_key + "\n-----END PRIVATE KEY-----\n"

    data["private_key"] = fixed_private_key

    # Save to a NEW file to be safe
    try:
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
        print(f"✅ Created fixed key: '{output_file}'")
        print(f"➡️  Rename '{output_file}' to '{input_file}' to use it.")
        print("   (Or delete the old one and rename this one)")
    except Exception as e:
        print(f"❌ Failed to write file: {e}")

if __name__ == "__main__":
    fix_key()
