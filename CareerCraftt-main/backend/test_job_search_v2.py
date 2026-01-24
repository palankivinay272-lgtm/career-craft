from duckduckgo_search import DDGS

def test_job_search():
    results = []
    # Simplified Query: "Software Engineer jobs India site:linkedin.com"
    # We'll rely on the search engine's recency filter
    query = 'software engineer jobs india (site:linkedin.com OR site:naukri.com OR site:indeed.com)'
    
    print(f"🔍 Searching: {query}...")
    
    try:
        with DDGS() as ddgs:
            # removing 'timelimit' temporarily to see if we get ANY results first
            generator = ddgs.text(query, region='in-en', max_results=5)
            for r in generator:
                results.append(r)
    except Exception as e:
        print(f"Error: {e}")

    print(f"✅ Found {len(results)} jobs:")
    for res in results:
        print(f"\nTitle: {res['title']}")
        print(f"Link: {res['href']}")
        print(f"Snippet: {res['body']}")

if __name__ == "__main__":
    test_job_search()
