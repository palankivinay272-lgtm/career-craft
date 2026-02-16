import os

def replace_urls(directory, old_url, new_url):
    print(f"🚀 Replacing '{old_url}' with '{new_url}' in {directory}...")
    count = 0
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(".tsx") or file.endswith(".ts") or file.endswith(".js"):
                path = os.path.join(root, file)
                try:
                    with open(path, "r", encoding="utf-8") as f:
                        content = f.read()
                    
                    if old_url in content:
                        new_content = content.replace(old_url, new_url)
                        with open(path, "w", encoding="utf-8") as f:
                            f.write(new_content)
                        print(f"✅ Updated: {path}")
                        count += 1
                except Exception as e:
                    print(f"⚠️ Could not read {path}: {e}")
    
    if count == 0:
        print("⚠️ No files found containing the old URL. Already updated?")
    else:
        print(f"🎉 Success! Updated {count} files.")

if __name__ == "__main__":
    print("------------------------------------------------")
    print("      Frontend Backend URL Updater              ")
    print("------------------------------------------------")
    new_url = input("Enter your new Cloud Run URL (e.g., https://xyz.run.app): ").strip()
    
    # Remove trailing slash if present
    if new_url.endswith("/"):
        new_url = new_url[:-1]

    if not new_url:
        print("❌ Error: URL cannot be empty.")
    else:
        # Target the src directory relative to this script's location (assuming script is in root)
        # Script will be placed in project root
        target_dir = os.path.join("CareerCraft-main", "src")
        
        # Replace localhost
        replace_urls(target_dir, "http://localhost:8000", new_url)
        # Also try 127.0.0.1 just in case
        replace_urls(target_dir, "http://127.0.0.1:8000", new_url)
