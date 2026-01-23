import sys
import os
import io
import zipfile

# Mock a simple DOCX file (valid zip structure)
def create_dummy_docx():
    buffer = io.BytesIO()
    with zipfile.ZipFile(buffer, 'w') as z:
        # Minimal document.xml
        xml_content = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
        <w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
            <w:body>
                <w:p><w:r><w:t>Hello World from Native Extraction</w:t></w:r></w:p>
            </w:body>
        </w:document>"""
        z.writestr('word/document.xml', xml_content)
    buffer.seek(0)
    return buffer.read()

print(f"📂 CWD: {os.getcwd()}")
sys.path.append(os.getcwd())

print("🔍 Attempting to import main...")
try:
    import main
    print("✅ Import successful (App didn't crash on load)")
except ImportError as e:
    print(f"❌ Import Failed: {e}")
    sys.exit(1)
except Exception as e:
    print(f"❌ Crash on load: {e}")
    sys.exit(1)

print("🧪 Testing DOCX Extraction...")
try:
    dummy_bytes = create_dummy_docx()
    text = main.extract_text(dummy_bytes, "test.docx")
    print(f"📝 Extracted Text: '{text}'")
    if "Hello World from Native Extraction" in text:
        print("✅ SUCCESS: Native DOCX extraction works!")
    else:
        print("❌ FAILURE: Text not found.")
except Exception as e:
    print(f"❌ Extraction Failed: {e}")
