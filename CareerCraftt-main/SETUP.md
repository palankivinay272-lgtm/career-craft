# CareerCraft Setup Guide

## Prerequisites
- Node.js (for frontend)
- Python 3.9+ (for backend)

## 1. Backend Setup (FastAPI)

Navigate to the backend directory:
```bash
cd backend
```

### Install Dependencies
```bash
pip install -r requirements.txt
```

### Install Spacy Model
The app attempts to download this automatically, but you can install it manually if needed:
```bash
python -m spacy download en_core_web_sm
```

### Firebase Credentials
**IMPORTANT:** You need the `serviceAccountKey.json` file.
1. Get this file from the project owner (it is not in Git for security).
2. Place it inside the `backend/` folder.
   - Path should be: `backend/serviceAccountKey.json`

### Run Backend Server
```bash
# Windows
start_server.bat

# Or manually
python -m uvicorn main:app --reload
```
The server will start at `http://127.0.0.1:8000`.

---

## 2. Frontend Setup (React + Vite)

Navigate to the frontend directory:
```bash
cd ../CareerCraft-main
```

### Install Dependencies
```bash
npm install
```

### Run Frontend
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.
