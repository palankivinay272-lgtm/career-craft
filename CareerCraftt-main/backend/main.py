import logging
import sys
from fastapi import FastAPI, UploadFile, File, Form, Depends
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Text
from sqlalchemy.orm import sessionmaker, declarative_base, Session
from pydantic import BaseModel
import pdfplumber
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# ---------------- LOGGING ----------------
logging.basicConfig(level=logging.INFO, stream=sys.stdout)
logger = logging.getLogger(__name__)

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
    {"role": "Python Backend Developer", "company": "TechNova", "skills": "python django fastapi sql api"},
    {"role": "Full Stack Developer", "company": "Webify", "skills": "react node python mongodb"},
    {"role": "Data Analyst", "company": "DataWorks", "skills": "python sql pandas numpy"},
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
    return {"success": data.get("username") == ADMIN_USERNAME and data.get("password") == ADMIN_PASSWORD}

@app.post("/admin/placements")
def add_placement(data: AdminPlacement):
    PLACEMENTS_DB.setdefault(data.college, []).append(data.dict(exclude={"college"}))
    return {"message": "Placement added"}

@app.delete("/admin/placements/{college}/{index}")
def delete_placement(college: str, index: int):
    if college in PLACEMENTS_DB and 0 <= index < len(PLACEMENTS_DB[college]):
        PLACEMENTS_DB[college].pop(index)
        return {"message": "Deleted"}
    return {"error": "Not found"}

@app.get("/placements/{college}")
def get_placements(college: str):
    return PLACEMENTS_DB.get(college, [])

# ---------------- HELPERS ----------------
def extract_text(file):
    text = ""
    with pdfplumber.open(file) as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ""
    return text.lower()

def similarity(a, b):
    cv = CountVectorizer()
    mat = cv.fit_transform([a, b])
    return round(cosine_similarity(mat)[0][1] * 100, 2)

# ---------------- AUTH ----------------
@app.post("/signup")
def signup(user: UserAuth, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user.email).first():
        return JSONResponse(status_code=400, content={"success": False})
    db.add(User(email=user.email, password=user.password))
    db.commit()
    return {"success": True}

@app.post("/login")
def login(user: UserAuth, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or db_user.password != user.password:
        return JSONResponse(status_code=401, content={"success": False})
    return {"success": True, "user": user.email.split("@")[0], "email": user.email}

# ---------------- RESUME ----------------
@app.post("/analyze-resume")
async def analyze_resume(
    resume: UploadFile = File(...),
    job_description: str = Form(...),
    email: str = Form(...),
    db: Session = Depends(get_db)
):
    resume_text = extract_text(resume.file)
    saved = db.query(Resume).filter(Resume.email == email).first()
    if saved:
        saved.text = resume_text
    else:
        db.add(Resume(email=email, text=resume_text))
    db.commit()
    return {"ats_score": similarity(resume_text, job_description)}

@app.get("/job-matches/{email}")
def job_matches(email: str, db: Session = Depends(get_db)):
    resume = db.query(Resume).filter(Resume.email == email).first()
    if not resume:
        return []
    return [
        {"role": j["role"], "company": j["company"], "match": similarity(resume.text, j["skills"])}
        for j in JOBS_DB
    ]
