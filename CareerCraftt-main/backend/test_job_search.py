from duckduckgo_search import DDGS
import json

def test_job_search():
    results = []
    # Search for "Software Engineer jobs" on specific sites, past 3 days (w='3d')
    query = 'site:linkedin.com/jobs/view OR site:naukri.com/job-listings OR site:indeed.com/viewjob "Software Engineer" India'
    
    print(f"🔍 Searching: {query}...")
    
    with DDGS() as ddgs:
        # region='in-en' (India English), time='d' (Day) or 'w' (Week). DDG usually supports 'd', 'w', 'm'.
        # We will try 'd' for "past day" to be strict about freshness, or 'w' for past week.
        for r in ddgs.text(query, region='in-en', timelimit='w', max_results=10):
            results.append(r)

    print(f"✅ Found {len(results)} jobs:")
    for res in results:
        print(f"\nTitle: {res['title']}")
        print(f"Link: {res['href']}")
        print(f"Snippet: {res['body']}")

if __name__ == "__main__":
    test_job_search()
