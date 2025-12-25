import subprocess
import os
import sys

def log(msg):
    print(msg)
    with open("git_execution_log.txt", "a", encoding="utf-8") as f:
        f.write(msg + "\n")

def run_git(args):
    try:
        repo_root = r"c:\career-craft"
        log(f"--- Running: git {' '.join(args)} ---")
        
        result = subprocess.run(
            ["git"] + args,
            cwd=repo_root,
            capture_output=True,
            text=True,
            check=False
        )
        output = f"STDOUT:\n{result.stdout}\nSTDERR:\n{result.stderr}\n"
        log(output)
        return result.returncode
    except Exception as e:
        log(f"Error running git {' '.join(args)}: {e}")
        return -1

# Clear log
with open("git_execution_log.txt", "w", encoding="utf-8") as f:
    f.write("Starting Git Operations...\n")

run_git(["remote", "-v"])
run_git(["config", "user.name"])
run_git(["config", "user.email"])
run_git(["status"])
run_git(["add", "."])
run_git(["commit", "-m", "feat: Add new quiz domains and fix seeding"])
# run_git(["push"]) # Commented out push for now

