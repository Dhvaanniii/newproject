from fastapi import FastAPI
from auth import router as auth_router
from game import router as game_router
from schemas import ReportRequest
from report import generate_report_range
from utils import send_report_email
from database import users_collection
import os

app = FastAPI()

app.include_router(auth_router)
app.include_router(game_router)

@app.post("/report/generate")
def custom_report(data: ReportRequest):
    file_path = generate_report_range(data.username, data.start_date, data.end_date)

    if data.send_email:
        user = users_collection.find_one({"username": data.username})
        if user:
            send_report_email(
                to_email=user["email"],
                subject=f"Your Puzzle Report ({data.start_date} to {data.end_date})",
                body="Please find your report attached.",
                attachment_path=file_path
            )

    return {
        "msg": "Report generated successfully",
        "path": file_path,
        "emailed": data.send_email
    }

from admin_upload import router as admin_router
app.include_router(admin_router)
