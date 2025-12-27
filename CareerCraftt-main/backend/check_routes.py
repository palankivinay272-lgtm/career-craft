import sys
import os
sys.path.append(os.getcwd())
from main import app

print("--- REGISTERED ROUTES ---")
for route in app.routes:
    print(f"{route.path} [{route.name}]")
