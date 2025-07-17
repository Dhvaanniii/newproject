from fastapi import UploadFile, File, APIRouter
import os
import shutil
from PyPDF2 import PdfReader

router = APIRouter()

@router.post("/admin/upload-tangle-pdf")
async def upload_tangle_pdf(file: UploadFile = File(...)):
    folder = "tangle_pdfs"
    os.makedirs(folder, exist_ok=True)

    # Count existing levels
    level_start = 1
    for fname in sorted(os.listdir(folder)):
        if fname.startswith("level_") and fname.endswith(".pdf"):
            try:
                num = int(fname.split("_")[1].split(".")[0])
                level_start = max(level_start, num + 1)
            except:
                continue

    # Save uploaded PDF
    temp_path = f"{folder}/temp_upload.pdf"
    with open(temp_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    reader = PdfReader(temp_path)
    total_pages = len(reader.pages)

    # New name
    level_end = level_start + total_pages - 1
    new_filename = f"level_{level_start}_{level_end}.pdf"
    os.rename(temp_path, os.path.join(folder, new_filename))

    return {"message": "Upload successful", "pages": total_pages, "filename": new_filename}
