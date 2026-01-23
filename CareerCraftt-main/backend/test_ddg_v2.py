from duckduckgo_search import DDGS
import time

def test_job_search(query):
    print(f"\n--- Searching: {query} ---")
    try:
        results = DDGS().text(query, max_results=3)
        found = False
        for r in results:
            print(f"✅ Found: {r['title']}")
            print(f"   URL: {r['href']}")
            found = True
        
        if not found:
            print("❌ No results found")
            
    except Exception as e:
        print(f"⚠️ Error: {e}")
    time.sleep(1)

# Broaden the query. Don't use site:linkedin/jobs/view which is non-indexed.
# Just look for the job title + company + "India" + "Apply"
test_job_search('+"Software Engineer" +"Google" +India +LinkedIn') 
test_job_search('+"Python Developer" +"TCS" +India +LinkedIn')
test_job_search('+"Rust Developer" +"Netflix" +India +LinkedIn') 
