from fastapi import FastAPI, UploadFile, File, Form, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Text
from sqlalchemy.orm import sessionmaker, declarative_base, Session
import pdfplumber
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- DB ----------------
DATABASE_URL = "sqlite:///./career.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

class Resume(Base):
    __tablename__ = "resumes"
    id = Column(Integer, primary_key=True)
    email = Column(String, index=True, unique=True)
    text = Column(Text)

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ---------------- JOB DATA ----------------
JOBS_DB = [
    {"role": "Python Backend Developer", "company": "TechNova", "skills": "python django fastapi sql api"},
    {"role": "Full Stack Developer", "company": "Webify", "skills": "react node python mongodb"},
    {"role": "Data Analyst", "company": "DataWorks", "skills": "python sql pandas numpy"},
]

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

# ---------------- API ----------------
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

    ats = similarity(resume_text, job_description)

    return {"ats_score": ats}

@app.get("/job-matches/{email}")
def job_matches(email: str, db: Session = Depends(get_db)):
    resume = db.query(Resume).filter(Resume.email == email).first()
    if not resume:
        return []

    results = []
    for job in JOBS_DB:
        score = similarity(resume.text, job["skills"])
        results.append({
            "role": job["role"],
            "company": job["company"],
            "match": score
        })

    return sorted(results, key=lambda x: x["match"], reverse=True)

@app.get("/resume-improvements/{email}")
def improvements(email: str, db: Session = Depends(get_db)):
    resume = db.query(Resume).filter(Resume.email == email).first()
    if not resume:
        return []

    keywords = ["python", "django", "fastapi", "sql", "api"]
    missing = [k for k in keywords if k not in resume.text]
    return [f"Add experience with {k}" for k in missing]