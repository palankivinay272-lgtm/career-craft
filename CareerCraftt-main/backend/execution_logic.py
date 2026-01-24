import subprocess
import tempfile

class TestCase(BaseModel):
    input: str
    output: str

class CodeSubmission(BaseModel):
    language: str 
    code: str
    test_cases: list[TestCase]

@app.post("/execute")
async def execute_code(submission: CodeSubmission):
    try:
        # Create a temporary directory for execution
        with tempfile.TemporaryDirectory() as temp_dir:
            file_name_map = {
                "python": "solution.py",
                "c": "main.c",
                "cpp": "main.cpp",
                "java": "Main.java"
            }
            
            if submission.language not in file_name_map:
                return JSONResponse(status_code=400, content={"error": "Unsupported language"})
            
            file_name = file_name_map[submission.language]
            file_path = os.path.join(temp_dir, file_name)
            
            # Write code to file
            with open(file_path, "w") as f:
                f.write(submission.code)
            
            # Compilation Step
            execute_cmd = []
            if submission.language == "c":
                compile_cmd = ["gcc", file_path, "-o", os.path.join(temp_dir, "main")]
                result = subprocess.run(compile_cmd, capture_output=True, text=True)
                if result.returncode != 0:
                    return {"status": "Compilation Error", "details": [], "runtime": "0ms", "error": result.stderr}
                execute_cmd = [os.path.join(temp_dir, "main")]
            
            elif submission.language == "cpp":
                compile_cmd = ["g++", file_path, "-o", os.path.join(temp_dir, "main")]
                result = subprocess.run(compile_cmd, capture_output=True, text=True)
                if result.returncode != 0:
                    return {"status": "Compilation Error", "details": [], "runtime": "0ms", "error": result.stderr}
                execute_cmd = [os.path.join(temp_dir, "main")]
            
            elif submission.language == "java":
                compile_cmd = ["javac", file_path]
                result = subprocess.run(compile_cmd, capture_output=True, text=True)
                if result.returncode != 0:
                    return {"status": "Compilation Error", "details": [], "runtime": "0ms", "error": result.stderr}
                execute_cmd = ["java", "-cp", temp_dir, "Main"]
            
            elif submission.language == "python":
                execute_cmd = ["python3", file_path]

            # Execution Step
            results = []
            failed = False
            
            for index, test in enumerate(submission.test_cases):
                try:
                    # Run the code
                    run_result = subprocess.run(
                        execute_cmd, 
                        input=test.input, 
                        capture_output=True, 
                        text=True, 
                        timeout=2 # 2 second timeout
                    )
                    
                    actual_output = run_result.stdout.strip()
                    expected_output = test.output.strip()
                    
                    status = "Passed"
                    if run_result.returncode != 0:
                        status = "Runtime Error"
                        actual_output = run_result.stderr
                        failed = True
                    elif actual_output != expected_output:
                        status = "Failed"
                        failed = True
                    
                    results.append({
                        "id": index + 1,
                        "status": status,
                        "input": test.input,
                        "output": actual_output,
                        "expected": expected_output
                    })

                except subprocess.TimeoutExpired:
                   results.append({
                        "id": index + 1,
                        "status": "Time Limit Exceeded",
                        "input": test.input,
                        "output": "Execution timed out",
                        "expected": test.output
                    })
                   failed = True

            return {
                "status": "Wrong Answer" if failed else "Accepted",
                "details": results,
                "runtime": "12ms" # Mock runtime for now or calculate actual
            }

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

# Add to main.py before running
