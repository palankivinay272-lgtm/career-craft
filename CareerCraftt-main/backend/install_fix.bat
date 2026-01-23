@echo off
echo ==========================================
echo      CareerCraft Dependency Fixer
echo ==========================================

echo [1/3] Checking Python...
python --version
if %errorlevel% neq 0 (
    echo Python not found! Please install Python.
    pause
    exit /b
)

echo [2/3] Installing python-docx and google-genai...
python -m pip install --upgrade pip
python -m pip install python-docx pypdf google-genai
if %errorlevel% neq 0 (
    echo Failed to install dependencies.
    pause
    exit /b
)

echo [3/3] Starting Backend...
cd c:\career-craft\CareerCraftt-main\backend
python -m uvicorn main:app --reload

pause
