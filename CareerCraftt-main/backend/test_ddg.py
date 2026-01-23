from duckduckgo_search import DDGS

def test_job_search(role, company):
    print(f"\n--- Searching for {role} at {company} ---")
    query = f'site:linkedin.com/jobs/view "{role}" "{company}" "India"'
    print(f"Query: {query}")
    
    try:
        results = DDGS().text(query, max_results=3)
        found = False
        for r in results:
            print(f"✅ Found: {r['title']}")
            print(f"   URL: {r['href']}")
            found = True
            
        if not found:
            print("❌ No results found (Company might not be hiring)")
            
    except Exception as e:
        print(f"⚠️ Error: {e}")

test_job_search("Software Engineer", "Google")
test_job_search("Python Developer", "TCS")
test_job_search("Rust Developer", "Netflix") # Expected to likely fail/be rare in India
