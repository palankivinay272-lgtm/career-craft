import logging
import sys
from fastapi import FastAPI, UploadFile, File, Form, Depends
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Text
from sqlalchemy.orm import sessionmaker, declarative_base, Session
from pydantic import BaseModel
import io
import re
import spacy
from pdfminer.high_level import extract_text as pdf_extract_text
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# ---------------- LOGGING ----------------
logging.basicConfig(level=logging.INFO, stream=sys.stdout)
logger = logging.getLogger(__name__)

# ---------------- FIREBASE INIT (Global) ----------------
# Ensures Firebase is initialized when the server starts
from firebase_config import firebase_client
# --------------------------------------------------------

app = FastAPI()

# ---------------- CORS ----------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- DATABASE ----------------
DATABASE_URL = "sqlite:///./career.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

# ---------------- MODELS ----------------
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)

class Resume(Base):
    __tablename__ = "resumes"
    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, index=True)
    text = Column(Text)

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ---------------- SCHEMAS ----------------
class UserAuth(BaseModel):
    email: str
    password: str

class AdminPlacement(BaseModel):
    college: str
    company: str
    totalHires: int
    domains: list[str]
    roles: list[str]

# ---------------- JOB DATA ----------------
JOBS_DB = [
    {"role": "Python Backend Developer", "company": "TechNova", "skills": "python django fastapi sql api", "location": "Remote", "salary": "$120k - $150k"},
    {"role": "Full Stack Developer", "company": "Webify", "skills": "react node python mongodb typescript", "location": "San Francisco, CA", "salary": "$130k - $160k"},
    {"role": "Data Analyst", "company": "DataWorks", "skills": "python sql pandas numpy tableau", "location": "New York, NY", "salary": "$90k - $115k"},
    {"role": "React Frontend Engineer", "company": "Creative UI", "skills": "react javascript css tailwind redux", "location": "Austin, TX", "salary": "$110k - $140k"},
    {"role": "DevOps Engineer", "company": "CloudScale", "skills": "aws docker kubernetes linux python", "location": "Remote", "salary": "$140k - $170k"},
    {"role": "Machine Learning Engineer", "company": "AI Future", "skills": "python tensorflow pytorch scikit-learn", "location": "Boston, MA", "salary": "$150k - $190k"},
    {"role": "Java Developer", "company": "Enterprise Sol", "skills": "java spring boot sql hibernate", "location": "Chicago, IL", "salary": "$115k - $135k"},
    {"role": "Mobile App Developer", "company": "Appify", "skills": "react native flutter ios android", "location": "Los Angeles, CA", "salary": "$120k - $145k"},
    {"role": "Cybersecurity Analyst", "company": "SecureNet", "skills": "network security linux python firewalls", "location": "Washington, DC", "salary": "$100k - $130k"},
    {"role": "Product Manager", "company": "InnovateX", "skills": "agile jira product management communication", "location": "Seattle, WA", "salary": "$130k - $160k"},
]

# ---------------- PLACEMENTS DATA (20 COLLEGES × 10 COMPANIES) ----------------
def companies():
    return [
        {"company": "TCS", "totalHires": 40, "domains": ["Java"], "roles": ["SE"]},
        {"company": "Infosys", "totalHires": 35, "domains": ["Python"], "roles": ["SE"]},
        {"company": "Wipro", "totalHires": 30, "domains": ["Testing"], "roles": ["QA"]},
        {"company": "Accenture", "totalHires": 28, "domains": ["Cloud"], "roles": ["Associate"]},
        {"company": "Capgemini", "totalHires": 25, "domains": ["Java"], "roles": ["Consultant"]},
        {"company": "Cognizant", "totalHires": 32, "domains": ["Data"], "roles": ["Analyst"]},
        {"company": "HCL", "totalHires": 20, "domains": ["Infra"], "roles": ["Engineer"]},
        {"company": "IBM", "totalHires": 18, "domains": ["AI"], "roles": ["Engineer"]},
        {"company": "Oracle", "totalHires": 15, "domains": ["SQL"], "roles": ["Associate"]},
        {"company": "Tech Mahindra", "totalHires": 22, "domains": ["Network"], "roles": ["Engineer"]},
    ]

PLACEMENTS_DB = {
    "ABC College": companies(),
    "XYZ University": companies(),
    "IIT Delhi": companies(),
    "IIT Bombay": companies(),
    "IIT Madras": companies(),
    "NIT Trichy": companies(),
    "NIT Warangal": companies(),
    "NIT Surathkal": companies(),
    "BITS Pilani": companies(),
    "VIT Vellore": companies(),
    "SRM University": companies(),
    "Amity University": companies(),
    "Anna University": companies(),
    "JNTU Hyderabad": companies(),
    "Osmania University": companies(),
    "Manipal University": companies(),
    "PES University": companies(),
    "Christ University": companies(),
    "Lovely Professional University": companies(),
    "SASTRA University": companies(),
}

# ---------------- ADMIN ----------------
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "admin123"

@app.post("/admin/login")
def admin_login(data: dict):
    from firebase_config import firebase_client
    username = data.get("username")
    password = data.get("password")
    
    print(f"🔹 Login Attempt: {username} | {password}")

    # 1. Check if using Master Admin (fallback)
    if username == ADMIN_USERNAME and password == ADMIN_PASSWORD:
         print("✅ matched SUPER_ADMIN")
         return {"success": True, "college": "SUPER_ADMIN"}

    # 2. Check Firestore "placement_officers"
    db = firebase_client.db
    if db:
        doc_ref = db.collection("placement_officers").document(username)
        doc = doc_ref.get()
        if doc.exists:
            admin_data = doc.to_dict()
            print(f"🔸 Found Firestore Doc: {admin_data}")
            if admin_data.get("password") == password:
                print("✅ Password Matched!")
                return {"success": True, "college": admin_data.get("college")}
            else:
                 print("❌ Password Mismatch")
        else:
             print("❌ Doc does not exist")
    else:
         print("❌ DB not initialized")
    
    return {"success": False}

@app.post("/admin/placements")
def add_placement(data: AdminPlacement):
    from firebase_config import firebase_client
    from firebase_admin import firestore # <--- Added import
    db = firebase_client.db
    if not db:
        # Fallback to local if no firebase 
        PLACEMENTS_DB.setdefault(data.college, []).append(data.dict(exclude={"college"}))
        return {"message": "Placement added (Local Fallback)"}

    # Firestore approach: Update the 'companies' field in the college document
    doc_ref = db.collection("placements").document(data.college)
    
    # We want to append to the list. Firestore arrayUpdate is best.
    doc_ref.set({
        "companies": firestore.ArrayUnion([data.dict(exclude={"college"})])
    }, merge=True)
    
    return {"message": "Placement added to Firestore"}

@app.delete("/admin/placements/{college}/{index}")
def delete_placement(college: str, index: int):
    # NOTE: Deleting by index in Firestore array is hard. 
    # Requires reading the whole array, removing item, and writing back.
    from firebase_config import firebase_client
    db = firebase_client.db
    if not db:
        if college in PLACEMENTS_DB and 0 <= index < len(PLACEMENTS_DB[college]):
            PLACEMENTS_DB[college].pop(index)
            return {"message": "Deleted (Local)"}
        return {"error": "Not found"}

    doc_ref = db.collection("placements").document(college)
    doc = doc_ref.get()
    
    if doc.exists:
        data = doc.to_dict()
        companies = data.get("companies", [])
        if 0 <= index < len(companies):
            del companies[index]
            doc_ref.update({"companies": companies})
            return {"message": "Deleted from Firestore"}
            
    return {"error": "Not found"}

@app.get("/placements/{college}")
def get_placements(college: str):
    from firebase_config import firebase_client
    db = firebase_client.db
    if not db:
        return PLACEMENTS_DB.get(college, [])
        
    doc_ref = db.collection("placements").document(college)
    doc = doc_ref.get()
    if doc.exists:
        return doc.to_dict().get("companies", [])
    return []

# ---------------- HELPERS ----------------
# ---------------- HELPERS ----------------

# Load Spacy Model
try:
    nlp = spacy.load("en_core_web_sm")
except:
    print("Downloading Spacy Model...")
    from spacy.cli import download
    download("en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

def extract_text(file_bytes):
    # Takes bytes, returns string
    try:
        if isinstance(file_bytes, bytes):
            return pdf_extract_text(io.BytesIO(file_bytes))
        return ""
    except Exception as e:
        print(f"Error extracting text: {e}")
        return ""

def analyze_content(resume_text, jd_text):
    # Returns (score, missing_keywords_list)
    if not resume_text or not jd_text:
        return 0.0, []

    # 1. TF-IDF Cosine Similarity (Context Match)
    tfidf_score = 0.0
    try:
        cv = TfidfVectorizer(stop_words='english')
        mat = cv.fit_transform([resume_text, jd_text])
        tfidf_score = cosine_similarity(mat)[0][1] * 100
    except:
        tfidf_score = 0.0

    # 2. Keyword Match (Skill Match)
    resume_doc = nlp(resume_text.lower())
    jd_doc = nlp(jd_text)
    
    resume_tokens = {token.text.lower() for token in resume_doc if not token.is_stop and not token.is_punct}
    
    # IGNORE these common non-skill words to improve accuracy
    STOP_WORDS = {
        "experience", "role", "team", "candidate", "work", "knowledge", "proficiency", 
        "understanding", "familiarity", "ability", "skills", "qualifications", "preferred",
        "internship", "technologies", "environment", "solutions", "problems", "management",
        "degree", "university", "graduate", "student", "level", "entry", "years", "job", 
        "description", "responsibilities", "requirements", "plus", "history", "employment",
        "apis", "assist", "backend", "control", "dashboards", "database", "device", "issues",
        "infrastructure", "introduction"
    }

    # Extract "Important Words" from JD
    jd_keywords = set()
    for token in jd_doc:
         # We want Nouns/Proper Nouns that are NOT in our stop list
         if token.pos_ in ["PROPN", "NOUN"] and not token.is_stop and not token.is_punct:
            clean_word = re.sub(r'[^a-zA-Z0-9]', '', token.text).lower()
            if len(clean_word) > 2 and clean_word not in STOP_WORDS:
                jd_keywords.add(clean_word)
    
    if not jd_keywords:
        return round(tfidf_score, 2), []

    # Count Matches
    matched_count = 0
    missing = []
    
    for kw in jd_keywords:
        if kw in resume_tokens:
            matched_count += 1
        else:
            missing.append(kw.capitalize())

    keyword_score = (matched_count / len(jd_keywords)) * 100
    
    # 3. Hybrid Score formula
    # 70% Weight to Keywords (Increased from 60 to prioritize specific skills)
    # 30% Weight to Text Similarity 
    
    if tfidf_score < 15:
        final_score = keyword_score # Resume content might be broken, trust keywords
    else:
        final_score = (0.7 * keyword_score) + (0.3 * tfidf_score)
        
    # BOOST: If you have >80% of keywords, round up to 90+
    if keyword_score > 80:
        final_score = max(final_score, 85) # Ensure high score for good matches

    return round(final_score, 1), sorted(missing)[:15] # Top 15 missing words

def analyze_quality(resume_text):
    suggestions = []
    text_lower = resume_text.lower()
    
    # 1. Contact Info Checks
    if not re.search(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', resume_text):
        suggestions.append("⚠️ Missing Email Address")
    
    if not re.search(r'\b\d{10,}\b', resume_text) and not re.search(r'\+\d{1,3}[-.\s]?\d{10}', resume_text):
        suggestions.append("⚠️ Missing Phone Number")
        
    if "linkedin.com" not in text_lower:
        suggestions.append("💡 Add your LinkedIn Profile URL")
        
    # 2. Section Checks
    sections = {
        "experience": ["experience", "employment", "work history"],
        "education": ["education", "academic", "qualification"],
        "skills": ["skills", "technologies", "competencies"],
        "projects": ["projects", "personal projects"]
    }
    
    for section, keywords in sections.items():
        if not any(kw in text_lower for kw in keywords):
            suggestions.append(f"🚫 Missing '{section.capitalize()}' section")

    # 3. Content Length
    word_count = len(resume_text.split())
    if word_count < 200:
        suggestions.append("⚠️ Resume is too short (< 200 words). Add more detail.")
    elif word_count > 1500:
        suggestions.append("⚠️ Resume might be too long (> 2 pages). Keep it concise.")

    # 4. Action Verbs & Smart Rewriter
    strong_verbs = [
        "led", "developed", "created", "managed", "designed", "architected", "implemented", "optimized", "achieved",
        "spearheaded", "orchestrated", "engineered", "facilitated", "mentored"
    ]
    
    # "Weak" verb detection
    weak_verbs = {
        "worked": ["Collaborated", "Contributed", "Engineered"],
        "helped": ["Assisted", "Facilitated", "Supported"],
        "made": ["Built", "Constructed", "Developed"],
        "used": ["Utilized", "Leveraged", "Deployed"],
        "responsible": ["Accountable for", "Led", "Oversaw"]
    }
    
    verb_count = 0
    
    # Count strong verbs (Regex for word boundary)
    for verb in strong_verbs:
        if re.search(rf'\b{verb}\b', text_lower):
            verb_count += 1
            
    if verb_count < 3:
        suggestions.append(f"💡 Use more action verbs like 'Managed' or 'Created' (Found only {verb_count})")

    # Suggest replacements for weak verbs
    for weak, strong_opts in weak_verbs.items():
        if re.search(rf'\b{weak}\b', text_lower):
            suggestions.append(f"⚠️ Smart Tip: Swap '{weak}' with stronger words like '{strong_opts[0]}' or '{strong_opts[1]}'")

    return suggestions

# ---------------- AUTH ----------------
# ---------------- AUTH ----------------
# NOTE: Signups are now handled by Firebase on the frontend.
# The backend just needs to know who the user is for protected routes.

class TokenSchema(BaseModel):
    token: str
    college: str = None # 🆕 Optional college field

@app.post("/verify-token")
def verify_user(data: TokenSchema, db: Session = Depends(get_db)):
    """
    Verifies the Firebase ID Token sent from Frontend.
    If valid, ensures user exists in local SQLite AND Firestore.
    """
    from firebase_config import firebase_client
    
    decoded_token = firebase_client.verify_token(data.token)
    if not decoded_token:
        # Use a mock user for development if no firebase creds
        if data.token == "dev-token": 
             return {"success": True, "user": "dev", "email": "dev@example.com"}
        return JSONResponse(status_code=401, content={"success": False, "message": "Invalid Token"})

    email = decoded_token.get("email")
    uid = decoded_token.get("uid")
    
    # ---------------- FIRESTORE SYNC ----------------
    # Save/Update user in Firestore so we have a record in the DB
    stored_college = None
    try:
        from firebase_config import firebase_client
        from firebase_admin import firestore
        fs_db = firebase_client.db
        if fs_db:
            user_ref = fs_db.collection("users").document(uid)
            
            # 1. Get existing data first to find college
            doc = user_ref.get()
            if doc.exists:
                user_dict = doc.to_dict()
                stored_college = user_dict.get("college")
            
            # 2. Update with new info
            user_data = {
                "email": email,
                "uid": uid,
                "lastLogin": firestore.SERVER_TIMESTAMP
            }
            # Only update college if it's provided (e.g., during signup)
            if data.college:
                user_data["college"] = data.college
                stored_college = data.college # Use the new one if provided
                
            user_ref.set(user_data, merge=True)
            logger.info(f"Synced user {email} to Firestore (College: {stored_college})")
            
            # 📧 send welcome email (Async to not block login)
            try:
                import email_service
                email_service.send_email(
                    to_email=email,
                    subject="Welcome to CareerCraft! 🚀",
                    body=f"Hello,\n\nWelcome back to CareerCraft! We are glad to have you.\n\nHappy Learning,\nThe CareerCraft Team"
                )
            except Exception as e:
                logger.error(f"Email send failed: {e}")

    except Exception as e:
        logger.error(f"Failed to sync user to Firestore: {e}")
    # ------------------------------------------------

    
    # SQLite Sync Removed - Fully migrated to Firestore
    # db_user = db.query(User).filter(User.email == email).first()
    # ...

    return {
        "success": True, 
        "user": email.split("@")[0], 
        "email": email,
        "college": stored_college
    }

@app.post("/forgot-password")
async def forgot_password(request: dict):
    """
    Generates a Firebase Password Reset Link and sends it via Gmail SMTP.
    Payload: {"email": "user@example.com"}
    """
    email = request.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Email is required")

    try:
        from firebase_admin import auth
        import email_service

        # 1. Generate Link
        link = auth.generate_password_reset_link(email)
        
        # 2. Send Email
        subject = "Reset your CareerCraft Password 🔒"
        body = f"Hello,\n\nYou requested a password reset for your CareerCraft account.\n\nClick the link below to reset it:\n{link}\n\nIf you did not request this, please ignore this email.\n\n- CareerCraft Team"
        
        sent = email_service.send_email(email, subject, body)
        
        if sent:
            return {"success": True, "message": "Reset link sent to your email."}
        else:
            return JSONResponse(status_code=500, content={"success": False, "message": "Failed to send email."})

    except Exception as e:
        logger.error(f"Forgot Password Error: {e}")
        return JSONResponse(status_code=500, content={"success": False, "message": str(e)})

# ---------------- RESUME ----------------
@app.post("/analyze-resume")
async def analyze_resume(
    resume: UploadFile = File(...),
    job_description: str = Form(...),
    email: str = Form(...),
    uid: str = Form(None), # Optional for backward compatibility
    db: Session = Depends(get_db)
):
    # 1. Read File
    content = await resume.read()
    resume_text = extract_text(content)
    
    if not resume_text or len(resume_text) < 10:
        return JSONResponse(status_code=400, content={"error": "Could not extract text from PDF. Please upload a valid text-based PDF."})

    # 2. Calculate Matches
    ats_score, missing = analyze_content(resume_text, job_description)
    suggestions = analyze_quality(resume_text)

    # 3. Save to Firestore (Users Collection) - PRIMARY STORAGE
    if uid:
        try:
            from firebase_config import firebase_client
            from firebase_admin import firestore
            fs_db = firebase_client.db
            if fs_db:
                # Save Resume Text
                fs_db.collection("users").document(uid).set({
                    "resume_text": resume_text,
                    "last_analyzed": firestore.SERVER_TIMESTAMP,
                    "email": email # Ensure email is also there
                }, merge=True)

                # Save History (Subcollection)
                fs_db.collection("users").document(uid).collection("analysis_history").add({
                    "score": ats_score,
                    "timestamp": firestore.SERVER_TIMESTAMP,
                    "job_role": job_description[:50] + "..." if len(job_description)>50 else job_description,
                    "missing_count": len(missing)
                })
            # 4. Award XP (Gamification)
            user_ref = fs_db.collection("users").document(uid)
            user_doc = user_ref.get()
            current_xp = 0
            if user_doc.exists:
                current_xp = user_doc.to_dict().get("xp", 0)
            
            # +20 XP for Resume Analysis
            new_xp = current_xp + 20
            user_ref.update({"xp": new_xp})
        except Exception as e:
            print(f"Error saving to Firestore: {e}")
            
    # Legacy SQLite save removed/deprecated
    # saved = db.query(Resume).filter(Resume.email == email).first() ...

    return {
        "ats_score": ats_score,
        "missing_keywords": missing,
        "suggestions": suggestions
    }

@app.get("/analysis-history/{uid}")
def get_analysis_history(uid: str):
    from firebase_config import firebase_client
    from firebase_admin import firestore
    fs_db = firebase_client.db
    history = []
    
    if fs_db:
        try:
            # Get last 10 entries
            docs = fs_db.collection("users").document(uid)\
                .collection("analysis_history")\
                .order_by("timestamp", direction=firestore.Query.DESCENDING)\
                .limit(10).stream()
                
            for doc in docs:
                data = doc.to_dict()
                # Convert timestamp to string
                if data.get("timestamp"):
                    data["date"] = data["timestamp"].strftime("%Y-%m-%d %H:%M")
                    del data["timestamp"]
                history.append(data)
        except Exception as e:
            print(f"History fetch error: {e}")
            
    return history

@app.get("/debug-db")
def debug_db():
    from firebase_config import firebase_client
    info = {"status": "checking"}
    if not firebase_client.db:
        return {"error": "DB not initialized"}
    
    try:
        # Check specific collection
        docs = firebase_client.db.collection("interview_questions").stream()
        count = 0
        domains = set()
        for doc in docs:
            count += 1
            data = doc.to_dict()
            domains.add(data.get('domain'))
            
        info["count"] = count
        info["domains"] = list(domains)
        info["sample"] = "Found docs" if count > 0 else "No docs"
    except Exception as e:
        info["error"] = str(e)
        
    return info

@app.post("/seed-questions")
def trigger_seed():
    try:
        import seed_questions
        seed_questions.seed_questions()
        return {"status": "success", "message": "Database seeded successfully"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/interview-questions")
def get_interview_questions(domain: str, level: str, limit: int = 5):
    from firebase_config import firebase_client
    import random
    
    fs_db = firebase_client.db
    questions = []
    
    if fs_db:
        try:
            # Query Firestore
            docs = fs_db.collection("interview_questions")\
                .where(field_path="domain", op_string="==", value=domain)\
                .where(field_path="level", op_string="==", value=level)\
                .stream() # Fetch all matching (optimization: store count or sharded keys for huge DBs)
            
            all_questions = [doc.to_dict() for doc in docs]
            
            # Simple random selection
            if len(all_questions) > limit:
                questions = random.sample(all_questions, limit)
            else:
                questions = all_questions
                
        except Exception as e:
            print(f"Error fetching questions: {e}")
            
    return questions

@app.get("/job-matches/{uid}")
def job_matches(uid: str):
    print(f"🔍 DEBUG: /job-matches called for UID: {uid}")
    from firebase_config import firebase_client
    
    # 1. Get Resume Text from Firestore
    fs_db = firebase_client.db
    resume_text = ""
    
    if fs_db:
        # Fetch user doc by UID
        doc = fs_db.collection("users").document(uid).get()
        if doc.exists:
            data = doc.to_dict()
            resume_text = data.get("resume_text", "")
            print(f"✅ DEBUG: Found resume text. Length: {len(resume_text)}")
        else:
            print(f"❌ DEBUG: User document not found for UID: {uid}")
    else:
        print("❌ DEBUG: Firestore DB not initialized")
    
    # If no resume text found in Firestore, return empty (forced migration)
    if not resume_text:
        print("⚠️ DEBUG: No resume text available. Returning empty matches.")
        return []
        
    # 2. Get Jobs from Firestore
    fs_db = firebase_client.db
    jobs_data = []
    
    if fs_db:
        jobs_ref = fs_db.collection("jobs")
        docs = jobs_ref.stream()
        for doc in docs:
            jobs_data.append(doc.to_dict())
        print(f"✅ DEBUG: Fetched {len(jobs_data)} jobs from Firestore")
    else:
        jobs_data = JOBS_DB.copy() # Use copy to avoid mutating original
        print("⚠️ DEBUG: Using Fallback JOBS_DB")

    # 3. [NEW] Inject PLACEMENT Jobs if User has a College
    # Ensure 'data' exists (it typically does if resume_text was found, but be safe)
    user_college = data.get("college") if 'data' in locals() and data else None
    
    if user_college:
        print(f"🎓 DEBUG: User is from {user_college}. Looking for placements...")
        
        # 🩹 Normalize College Names (Handle Aliases & Case-Insensitivity)
        # 1. Map known aliases
        alias_map = {
            "lpu": "Lovely Professional University",
            "lpu university": "Lovely Professional University",
            "iit bombay": "IIT Bombay",
            "iit delhi": "IIT Delhi",
            # Add more as needed
        }
        normalized_input = user_college.lower().strip()
        
        if normalized_input in alias_map:
            user_college = alias_map[normalized_input]
        
        # 2. Case-Insensitive Lookup in PLACEMENTS_DB keys
        # This ensures "iit bombay" matches "IIT Bombay" in the DB key
        db_key = None
        for key in PLACEMENTS_DB.keys():
            if key.lower() == user_college.lower():
                db_key = key
                break
        
        # Use the matched DB key if found, otherwise keep original
        search_key = db_key if db_key else user_college
        
        # Get placements (Firestore or Local)
        placement_companies = []
        if fs_db:
            p_doc = fs_db.collection("placements").document(search_key).get()
            if p_doc.exists:
                placement_companies = p_doc.to_dict().get("companies", [])
        
        # Fallback to local if empty or no DB
        if not placement_companies:
            placement_companies = PLACEMENTS_DB.get(search_key, [])
            
        # Convert Placements to Jobs
        for p in placement_companies:
            # Create a job entry for each role
            for role in p.get("roles", ["Graduate Trainee"]):
                # Construct a "skill string" from domains
                skill_str = " ".join(p.get("domains", [])).lower()
                
                jobs_data.append({
                    "role": role,
                    "company": p.get("company"),
                    "skills": skill_str, # Use domains as skills for matching
                    "location": f"On-Campus ({search_key})",
                    "salary": "Placement Drive", # Special indicator
                    "is_placement": True
                })
        print(f"✅ DEBUG: Added {len(placement_companies)} placement companies (from {search_key}) to matching pool")

    results = []
    for j in jobs_data:
        # Use our smart hybrid scorer
        score, _ = analyze_content(resume_text, j.get("skills", ""))
        
        results.append({
            "role": j.get("role", "Unknown Role"), 
            "company": j.get("company", "Unknown Company"), 
            "match": score,
            "location": j.get("location", "Remote"),
            "salary": j.get("salary", "Competitive")
        })
        
    # Sort by match score (Highest first)
    results.sort(key=lambda x: x["match"], reverse=True)
    
    return results

# ---------------- INTERVIEW & DASHBOARD ----------------

class InterviewSession(BaseModel):
    uid: str
    domain: str
    score: int
    total: int

@app.post("/interview/complete")
def save_interview(data: InterviewSession):
    """
    Saves interview session to Firestore.
    """
    from firebase_config import firebase_client
    from firebase_admin import firestore
    
    fs_db = firebase_client.db
    if not fs_db:
        return {"error": "DB not initialized"}
        
    try:
        # Save to users/{uid}/interviews collection
        user_ref = fs_db.collection("users").document(data.uid)
        user_ref.collection("interviews").add({
            "domain": data.domain,
            "score": data.score,
            "total": data.total,
            "timestamp": firestore.SERVER_TIMESTAMP
        })
        
        # Award XP (+50 per interview)
        user_doc = user_ref.get()
        current_xp = 0
        if user_doc.exists:
            current_xp = user_doc.to_dict().get("xp", 0)
            
        new_xp = current_xp + 50
        user_ref.update({"xp": new_xp})
        
        return {"success": True, "new_xp": new_xp}
    except Exception as e:
        print(f"Error saving interview: {e}")
        return {"error": str(e)}

@app.get("/dashboard-stats/{uid}")
def get_dashboard_stats(uid: str):
    """
    Aggregates stats for the dashboard:
    1. Resumes Analyzed (Count)
    2. Practice Sessions (Count)
    3. Average Score (Interview)
    4. Recent Activity (Merged list)
    """
    from firebase_config import firebase_client
    from firebase_admin import firestore
    
    fs_db = firebase_client.db
    if not fs_db:
        return {"error": "DB not initialized"}

    stats = {
        "resumes_analyzed": 0,
        "first_resume_date": None,
        "practice_sessions": 0,
        "avg_score": 0,
        "recent_activity": []
    }
    
    try:
        user_ref = fs_db.collection("users").document(uid)
        
        # 1. Fetch Resume Analysis History
        resume_docs = user_ref.collection("analysis_history")\
            .order_by("timestamp", direction=firestore.Query.DESCENDING)\
            .limit(10).get()
            
        stats["resumes_analyzed"] = len(resume_docs) # Approx count based on recent history
        
        # 2. Fetch Interview History
        interview_docs = user_ref.collection("interviews")\
            .order_by("timestamp", direction=firestore.Query.DESCENDING)\
            .limit(10).get()
            
        stats["practice_sessions"] = len(interview_docs)
        
        # Calculate Average Score
        total_score = 0
        total_max = 0
        for doc in interview_docs:
            d = doc.to_dict()
            total_score += d.get("score", 0)
            total_max += d.get("total", 10)
            
        if total_max > 0:
            stats["avg_score"] = int((total_score / total_max) * 100)
            
        # 3. Merge Recent Activity
        activity = []
        
        for doc in resume_docs:
            d = doc.to_dict()
            ts = d.get("timestamp")
            if ts:
                activity.append({
                    "action": f"Analyzed Resume for {d.get('job_role', 'Job')}",
                    "time": ts,
                    "type": "resume"
                })
                
        for doc in interview_docs:
            d = doc.to_dict()
            ts = d.get("timestamp")
            if ts:
                activity.append({
                    "action": f"Completed {d.get('domain')} Quiz ({d.get('score')}/{d.get('total')})",
                    "time": ts, # datetime object
                    "type": "interview"
                })
                
        # Sort by time desc
        activity.sort(key=lambda x: x["time"], reverse=True)
        
        # Format time for frontend
        formatted_activity = []
        from datetime import datetime, timezone
        
        now = datetime.now(timezone.utc)
        
        for item in activity[:5]: # Top 5
            # Simple "time ago" logic
            diff = now - item["time"]
            if diff.days > 0:
                time_str = f"{diff.days} days ago"
            elif diff.seconds > 3600:
                time_str = f"{diff.seconds // 3600} hours ago"
            else:
                time_str = f"{diff.seconds // 60} mins ago"
                
            formatted_activity.append({
                "action": item["action"],
                "time": time_str
            })
            
        stats["recent_activity"] = formatted_activity

        # 4. Gamification Stats
        user_doc = user_ref.get()
        current_xp = 0
        if user_doc.exists:
            current_xp = user_doc.to_dict().get("xp", 0)
            
        # Level Logic: Level = XP // 500
        level = (current_xp // 500) + 1
        xp_next_level = 500
        
        stats["xp"] = current_xp
        stats["level"] = level
        stats["xp_progress"] = int((current_xp % 500) / 500 * 100)

    except Exception as e:
        print(f"Stats Error: {e}")
        
    return stats
