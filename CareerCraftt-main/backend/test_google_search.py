from googlesearch import search

def test_google():
    query = 'site:linkedin.com/jobs/view "Software Engineer" India'
    print(f"🔍 Google Searching: {query}...")
    
    results = []
    try:
        # num_results is the limit
        for j in search(query, num_results=5, advanced=True):
            results.append(j)
    except Exception as e:
        print(f"Error: {e}")

    print(f"✅ Found {len(results)} jobs:")
    for res in results:
        print(f"\nTitle: {res.title}")
        print(f"Link: {res.url}")
        print(f"Snippet: {res.description}")

if __name__ == "__main__":
    test_google()
