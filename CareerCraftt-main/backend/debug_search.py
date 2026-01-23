from googlesearch import search

try:
    print("Testing Google Search...")
    count = 0
    for res in search("site:linkedin.com/jobs/view software engineer", num_results=5, advanced=True):
        print(f"Result {count}: {res.title} - {res.url}")
        count += 1
    print("Success")
except Exception as e:
    print(f"Error: {e}")
