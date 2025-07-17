import fitz  # PyMuPDF
import os
from database import uploads_collection

def process_pdf(file_path: str, category: str, uploader: str):
    pdf = fitz.open(file_path)
    count = uploads_collection.count_documents({})
    base_level = count + 1
    outline_dir = f"outlines/{category}/"
    os.makedirs(outline_dir, exist_ok=True)

    for i, page in enumerate(pdf):
        img = page.get_pixmap()
        level_number = base_level + i
        img.save(f"{outline_dir}level_{level_number}.png")

    uploads_collection.insert_one({
        "uploader": uploader,
        "category": category,
        "pages": len(pdf),
        "created_at": datetime.now()
    })

    return {"msg": f"PDF uploaded, {len(pdf)} levels added"}
