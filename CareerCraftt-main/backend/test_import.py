import sys
import os
import traceback

sys.path.append(os.getcwd())

try:
    import main
    print("✅ Import Successful")
    with open("import_status.txt", "w") as f:
        f.write("SUCCESS")
except Exception as e:
    print(f"❌ Import Failed: {e}")
    with open("import_error.txt", "w") as f:
        traceback.print_exc(file=f)
