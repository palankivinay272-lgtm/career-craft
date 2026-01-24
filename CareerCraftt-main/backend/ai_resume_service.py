import os
import json
import logging
import requests

# Configure logging
logger = logging.getLogger(__name__)

def analyze_resume_gemini(resume_content: str, job_description: str = "", job_title: str = "", **kwargs) -> dict:
    """
    Analyzes a resume using Groq Cloud API (Llama 3).
    Returns a JSON object with the analysis.
    """
    
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        logger.error("❌ GROQ_API_KEY not found in environment")
        return {
            "overallScore": 0,
            "ATS": {"score": 0, "tips": [{"type": "improve", "tip": "Server Error: Missing Groq API Key"}]},
            "toneAndStyle": {"score": 0, "tips": []},
            "content": {"score": 0, "tips": []},
            "structure": {"score": 0, "tips": []},
            "skills": {"score": 0, "tips": []}
        }

    # Clean text content
    clean_text = resume_content.strip() if resume_content else ""
    if not clean_text or len(clean_text) < 50:
         return {
            "overallScore": 0,
            "ATS": {"score": 0, "tips": [{"type": "improve", "tip": "Resume content appears empty or too short."}]},
            "toneAndStyle": {"score": 0, "tips": []},
            "content": {"score": 0, "tips": []},
            "structure": {"score": 0, "tips": []},
            "skills": {"score": 0, "tips": []}
        }

    # Define the JSON Schema for the response
    json_structure = """
    {
      "overallScore": number, // Scale 0-100
      "ATS": {
        "score": number, // Scale 0-100
        "tips": [{"type": "good" | "improve", "tip": "string"}]
      },
      "toneAndStyle": {
        "score": number, // Scale 0-100
        "tips": [{"type": "good" | "improve", "tip": "string", "explanation": "string"}]
      },
      "content": {
        "score": number, // Scale 0-100
        "tips": [{"type": "good" | "improve", "tip": "string", "explanation": "string"}]
      },
      "structure": {
        "score": number, // Scale 0-100
        "tips": [{"type": "good" | "improve", "tip": "string", "explanation": "string"}]
      },
      "skills": {
        "score": number, // Scale 0-100
        "tips": [{"type": "good" | "improve", "tip": "string", "explanation": "string"}]
      }
    }
    """

    job_context = ""
    if job_title:
        job_context += f"\nTarget Job Title: {job_title}"
    if job_description:
        job_context += f"\nJob Description Consideration:\n{job_description[:2000]}"

    prompt = f"""
    You are an expert ATS (Applicant Tracking System) Resume Analyzer.
    Analyze the following resume text against the refined criteria.
    {job_context}
    
    CRITICAL INSTRUCTIONS:
    1. Return ONLY valid JSON. No markdown.
    2. SCORING: All scores must be between 0 and 100. (e.g., 85, not 8.5).
    
    Resume Text:
    {clean_text[:15000]}  # Truncate to avoid context limits if necessary
    
    Output JSON Structure:
    {json_structure}
    """

    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    data = {
        "model": "llama-3.3-70b-versatile", # Proven, high-quality, free model
        "messages": [
            {"role": "system", "content": "You are a helpful assistant that outputs ONLY JSON. Do not include markdown formatting like ```json ... ```. Do not output any thinking or explanations."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.1 # Low temp for consistent JSON
    }

    print("🔄 Sending request to Groq (Llama 3)...")
    
    try:
        # Use a session with retries for robustness
        session = requests.Session()
        from requests.adapters import HTTPAdapter
        from urllib3.util.retry import Retry
        
        retries = Retry(
            total=3,
            backoff_factor=1,
            status_forcelist=[429, 500, 502, 503, 504],
            allowed_methods=["POST"]
        )
        session.mount("https://", HTTPAdapter(max_retries=retries))
        
        response = session.post(url, headers=headers, json=data, timeout=30)
        
        if response.status_code != 200:
            logger.error(f"Groq API Error: {response.text}")
            raise Exception(f"Groq API returned {response.status_code}: {response.text}")

        result = response.json()
        content_str = result['choices'][0]['message']['content']
        
        # Parse JSON Robustly
        import re
        try:
            # Find first { and last }
            match = re.search(r'\{.*\}', content_str, re.DOTALL)
            if match:
                content_str = match.group(0)
            parsed_data = json.loads(content_str)
            print("✅ Groq Analysis Success")
            return parsed_data
        except json.JSONDecodeError:
            logger.error(f"JSON Decode Error. Raw Content: {content_str}")
            # Fallback for simple errors
            return {
                "overallScore": 0,
                "ATS": {"score": 0, "tips": [{"type": "improve", "tip": "AI Output Error: Try Again"}]},
                "toneAndStyle": {"score": 0, "tips": []},
                "content": {"score": 0, "tips": []},
                "structure": {"score": 0, "tips": []},
                "skills": {"score": 0, "tips": []}
            }

    except requests.exceptions.ConnectionError:
        logger.error("Connection Error: Could not reach Groq API.")
        return {
            "overallScore": 0,
            "ATS": {"score": 0, "tips": [{"type": "improve", "tip": "Network Error: Could not connect to AI Server (Check Internet/DNS)"}]},
            "toneAndStyle": {"score": 0, "tips": []},
            "content": {"score": 0, "tips": []},
            "structure": {"score": 0, "tips": []},
            "skills": {"score": 0, "tips": []}
        }
    except Exception as e:
        logger.error(f"Groq Analysis Failed: {e}")
        return {
            "overallScore": 0,
            "ATS": {"score": 0, "tips": [{"type": "improve", "tip": f"AI Parsing Failed: {str(e)[:100]}"}]},
            "toneAndStyle": {"score": 0, "tips": []},
            "content": {"score": 0, "tips": []},
            "structure": {"score": 0, "tips": []},
            "skills": {"score": 0, "tips": []}
        }

def analyze_interview_answer(question: str, answer: str, domain: str = "General") -> dict:
    """
    Analyzes a video interview answer using Groq Cloud API.
    Returns JSON validation logic.
    """
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        return {"score": 0, "feedback": "Server Error: Missing Groq API Key", "suggested_answer": "N/A"}

    if not answer or len(answer) < 5:
        return {"score": 0, "feedback": "Please provide a longer answer for analysis.", "suggested_answer": "N/A"}

    json_structure = """
    {
       "score": number, // 0-10
       "feedback": "string", // Constructive feedback (2-3 sentences)
       "suggested_answer": "string" // A better, concise answer
    }
    """

    prompt = f"""
    You are an expert Technical Interviewer for {domain}.
    
    Question: "{question}"
    Candidate Answer: "{answer}"
    
    Task:
    1. Rate the answer on a scale of 0-10 based on correctness, clarity, and depth.
    2. Provide constructive feedback.
    3. Provide a better, ideal suggested answer (concise).
    
    Output strictly in this JSON format:
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
            {"role": "system", "content": "You are a helpful assistant that outputs only JSON."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.3,
        "response_format": {"type": "json_object"}
    }
    
    try:
        response = requests.post(url, headers=headers, json=data, timeout=15)
        if response.status_code == 200:
            result = response.json()
            content_str = result['choices'][0]['message']['content']
            parsed = json.loads(content_str)
            return parsed
        else:
             return {"score": 0, "feedback": f"AI Error: {response.text}", "suggested_answer": "N/A"}
    except Exception as e:
        return {"score": 0, "feedback": f"Error: {e}", "suggested_answer": "N/A"}
