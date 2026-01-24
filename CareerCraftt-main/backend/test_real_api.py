import requests
import json

def test_remoteok():
    url = "https://remoteok.com/api"
    headers = {"User-Agent": "CareerCraft/1.0"}
    
    print(f"🌍 Fetching Real Jobs from {url}...")
    try:
        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code == 200:
            jobs = response.json()
            # The first element is usually legal disclaimer
            real_jobs = jobs[1:] if len(jobs) > 1 else []
            
            print(f"✅ Success! Found {len(real_jobs)} real jobs.")
            
            # Show first 3
            for j in real_jobs[:3]:
                print("-" * 40)
                print(f"Company: {j.get('company')}")
                print(f"Role: {j.get('position')}")
                print(f"Tags: {j.get('tags')}")
                print(f"URL: {j.get('url')}")
                print(f"Desc Length: {len(j.get('description', ''))}")
        else:
            print(f"❌ Failed: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_remoteok()
