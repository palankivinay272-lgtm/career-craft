
import json
import sys
import os

def validate():
    print("Checking serviceAccountKey.json...")
    if not os.path.exists("serviceAccountKey.json"):
        print("❌ File not found: serviceAccountKey.json")
        return

    try:
        with open("serviceAccountKey.json", "r") as f:
            data = json.load(f)
        
        print("✅ JSON is valid.")
    except json.JSONDecodeError as e:
        print(f"❌ JSON Decode Error: {e}")
        return

    required_fields = ["type", "project_id", "private_key_id", "private_key", "client_email", "client_id", "auth_uri", "token_uri", "auth_provider_x509_cert_url", "client_x509_cert_url"]
    
    missing = [field for field in required_fields if field not in data]
    if missing:
        print(f"❌ Missing fields: {missing}")
    else:
        print("✅ All required fields present.")

    private_key = data.get("private_key", "")
    
    if "-----BEGIN PRIVATE KEY-----" not in private_key:
        print("❌ 'private_key' is missing the standard header.")
    else:
        print("✅ 'private_key' header found.")

    if "-----END PRIVATE KEY-----" not in private_key:
        print("❌ 'private_key' is missing the standard footer.")
    else:
        print("✅ 'private_key' footer found.")
        
    if "\\n" in private_key:
        print("⚠️ 'private_key' contains literal backslash-n ('\\n'). This might be a copy-paste error if the JSON parser didn't interpret them as newlines. Ideally, in memory, they should be actual newlines.")
    
    # Check if we can import serialization to test validity
    try:
        from google.auth import crypt
        from google.auth import jwt
        import google.auth.exceptions
        
        signer = crypt.RSASigner.from_string_key(private_key)
        print("✅ Private key successfully parsed by google-auth.")
    except ImportError:
        print("⚠️ google-auth library not found, cannot verify key structure deeply.")
    except Exception as e:
        print(f"❌ Private key is invalid or corrupted: {e}")

if __name__ == "__main__":
    validate()
