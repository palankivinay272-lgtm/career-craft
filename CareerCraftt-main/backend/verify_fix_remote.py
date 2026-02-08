
import sys
import os

# Add backend to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from main import fetch_real_remote_jobs

def test_fetch():
    print("🧪 Testing fetch_real_remote_jobs with robust logic...")
    # This might fail slightly if network is totally dead, but we want to see if it CRASHES or handles it.
    try:
        jobs = fetch_real_remote_jobs("Software Engineer")
        if jobs and len(jobs) > 0:
            print(f"✅ Success! Got {len(jobs)} jobs. (Source: {jobs[0].get('source')})")
        else:
            print("⚠️ Got empty jobs list (unexpected but technical success if no crash)")
    except Exception as e:
        print(f"❌ FAILED: Function raised exception: {e}")

if __name__ == "__main__":
    test_fetch()
