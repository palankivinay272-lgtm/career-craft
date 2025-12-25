import requests
import sys

def create_pdf(filename, text):
    pdf_content = (
        b"%PDF-1.4\n"
        b"1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n"
        b"2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n"
        b"3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 500 500] "
        b"/Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >> "
        b"/Contents 4 0 R >>\nendobj\n"
        b"4 0 obj\n<< /Length " + str(len(text) + 20).encode() + b" >>\nstream\n"
        b"BT /F1 12 Tf 50 450 Td (" + text.encode() + b") Tj ET\n"
        b"endstream\nendobj\n"
        b"xref\n0 5\n0000000000 65535 f \n0000000010 00000 n \n0000000060 00000 n \n"
        b"0000000117 00000 n \n0000000320 00000 n \n"
        b"trailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n420\n%%EOF"
    )
    with open(filename, "wb") as f:
        f.write(pdf_content)

def test_api():
    url = "http://127.0.0.1:8000/analyze-resume"
    email = "test@example.com"
    
    print("\n--- TEST 1: USER SCENARIO (Network Engineer) ---")
    
    jd_user = """
    Job Title: Junior Network Automation Engineer
    Required Skills:
    * Proficiency in Python and Java.
    * Strong understanding of Computer Networks (Cisco, OSPF, Routing Protocols).
    * Experience with Network Automation and Simulation tools.
    * Knowledge of SQL and database management (MySQL or similar).
    * Familiarity with version control systems like Git and GitHub.
    """
    
    resume_text_user = """
    I am a Junior Network Automation Engineer. 
    I have strong proficiency in Python and Java.
    I typically work with Cisco routers and OSPF routing protocols.
    I use Network Automation tools and Simulation tools daily.
    I also know SQL, specifically MySQL, and use Git and GitHub for version control.
    """
    
    create_pdf("user_resume.pdf", resume_text_user)
    
    print(f"JD Length: {len(jd_user)} | Resume Length: {len(resume_text_user)}")
    try:
        with open("user_resume.pdf", "rb") as f:
            resp = requests.post(url, data={"job_description": jd_user, "email": email}, files={"resume": ("user.pdf", f, "application/pdf")})
            data = resp.json()
            print("Response Score:", data.get("ats_score"))
            print("Missing Keywords:", data.get("missing_keywords"))
    except Exception as e:
        print("Error:", e)

    # CASE 2: POOR MATCH
    # JD: Python, AWS
    # Resume: Java, C++
    jd2 = "We need a Python developer with AWS."
    create_pdf("bad_resume.pdf", "I use Java and C++.")
    
    print("\n--- TEST 2: POOR MATCH ---")
    print(f"JD: {jd2}")
    try:
        with open("bad_resume.pdf", "rb") as f:
            resp = requests.post(url, data={"job_description": jd2, "email": email}, files={"resume": ("bad.pdf", f, "application/pdf")})
            data = resp.json()
            print("Response Score:", data.get("ats_score"))
            print("Suggestions:", data.get("suggestions"))
    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    test_api()
