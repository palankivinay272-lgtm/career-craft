
import json
import os

def validate():
    output = []
    output.append("Checking serviceAccountKey.json...")
    if not os.path.exists("serviceAccountKey.json"):
        output.append("❌ File not found: serviceAccountKey.json")
        with open("validation_result.txt", "w", encoding="utf-8") as f:
            f.write("\n".join(output))
        return

    try:
        with open("serviceAccountKey.json", "r") as f:
            data = json.load(f)
        output.append("✅ JSON is valid.")
    except json.JSONDecodeError as e:
        output.append(f"❌ JSON Decode Error: {e}")
        with open("validation_result.txt", "w", encoding="utf-8") as f:
            f.write("\n".join(output))
        return

    private_key = data.get("private_key", "")
    
    if "-----BEGIN PRIVATE KEY-----" not in private_key:
        output.append("❌ 'private_key' is missing the standard header.")
    else:
        output.append("✅ 'private_key' header found.")

    if "-----END PRIVATE KEY-----" not in private_key:
        output.append("❌ 'private_key' is missing the standard footer.")
    else:
        output.append("✅ 'private_key' footer found.")
        
    if "\\n" in private_key:
        output.append("⚠️ 'private_key' contains literal backslash-n ('\\n'). This usually means the key was escaped twice. It should contain actual newlines.")
    else:
        output.append("ℹ️ 'private_key' does not contain literal \\n (this is good if it has actual newlines).")
        
    # Check newlines count
    newlines = private_key.count('\n')
    output.append(f"ℹ️ 'private_key' has {newlines} actual newline characters.")
    
    if newlines < 5:
        output.append("❌ 'private_key' has very few newlines. It might be a single line string, which is invalid.")

    with open("validation_result.txt", "w", encoding="utf-8") as f:
        f.write("\n".join(output))

if __name__ == "__main__":
    validate()
