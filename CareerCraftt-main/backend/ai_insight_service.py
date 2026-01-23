import os
import json
import logging
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

# Configure logging
logger = logging.getLogger(__name__)

def generate_market_intelligence(resume_content: str, job_description: str, job_title: str) -> dict:
    """
    Generates deep market intelligence using Groq (Llama 3).
    Returns:
    - Skill Gap Analysis (Missing vs Present)
    - Interview Questions (Behavioral & Technical)
    - Match Probability (with reasoning)
    - Salary/Role Insights
    """
    
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        logger.error("❌ GROQ_API_KEY not found")
        return {"error": "Server Error: Missing API Key"}

    # Define the JSON Schema for the response
    json_structure = """
    {
      "match_probability": {
        "score": number, // 0-100
        "reasoning": "string" // Why this score?
      },
      "skill_gap": {
        "missing_hard_skills": ["string"],
        "missing_soft_skills": ["string"],
        "present_skills": ["string"]
      },
      "interview_prediction": {
        "technical_questions": [
            {"question": "string", "context": "string (Why this question?)"}
        ],
        "behavioral_questions": [
             {"question": "string", "context": "string"}
        ]
      },
      "market_insights": {
        "estimated_level": "Junior" | "Mid" | "Senior" | "Lead",
        "key_responsibilities": ["string"]
      }
    }
    """

    prompt = f"""
    You are a Senior Technical Recruiter and Career Coach.
    Perform a deep "Market Intelligence" analysis on this candidate for the target role.
    
    Target Role: {job_title}
    Job Description Context:
    {job_description[:3000]}
    
    Resume Context:
    {resume_content[:15000]}
    
    GOAL: Provide actionable, strategic insights. Be critical but constructive.
    
    CRITICAL INSTRUCTIONS:
    1. Return ONLY valid JSON.
    2. Analyze specifically for gaps between the Resume and the JD.
    3. Predict 3 Technical and 2 Behavioral interview questions based on the candidate's WEAKNESSES or specific tech stack.
    
    Output JSON Structure:
    {json_structure}
    """

    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    data = {
        "model": "llama-3.3-70b-versatile",
        "messages": [
            {"role": "system", "content": "You are a strategic career advisor. Output strictly JSON."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.3,
        "response_format": {"type": "json_object"}
    }

    try:
        session = requests.Session()
        retries = Retry(total=3, backoff_factor=1, status_forcelist=[429, 500, 502, 503, 504])
        session.mount("https://", HTTPAdapter(max_retries=retries))
        
        print("🧠 Generative Market Intelligence...")
        response = session.post(url, headers=headers, json=data, timeout=45)
        
        if response.status_code != 200:
            raise Exception(f"Groq API Error: {response.text}")

        result = response.json()
        content_str = result['choices'][0]['message']['content']
        return json.loads(content_str)

    except Exception as e:
        logger.error(f"Insight Generation Failed: {e}")
        return {"error": str(e)}
