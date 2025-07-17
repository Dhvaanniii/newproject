from fpdf import FPDF
from database import attempts_collection
from datetime import datetime, timedelta

def generate_weekly_report(username):
    start_date = datetime.now() - timedelta(days=7)
    attempts = list(attempts_collection.find({
        "username": username,
        "timestamp": {"$gte": start_date}
    }))

    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    pdf.cell(200, 10, txt=f"{username} - Weekly Report", ln=True)

    total_points = 0
    for attempt in attempts:
        line = f"{attempt['category']} - Level {attempt['level']} - Attempt {attempt['attempt']} - {attempt['points']} pts"
        total_points += attempt['points']
        pdf.cell(200, 10, txt=line, ln=True)

    pdf.cell(200, 10, txt=f"Total Points: {total_points}", ln=True)

    path = f"reports/{username}_week_{datetime.now().strftime('%Y%m%d')}.pdf"
    os.makedirs("reports", exist_ok=True)
    pdf.output(path)
    return path

def generate_report_range(username, start_date, end_date):
    attempts = list(attempts_collection.find({
        "username": username,
        "timestamp": {
            "$gte": datetime.combine(start_date, datetime.min.time()),
            "$lte": datetime.combine(end_date, datetime.max.time())
        }
    }))

    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    pdf.cell(200, 10, txt=f"{username} Report ({start_date} to {end_date})", ln=True)

    total_points = 0
    for attempt in attempts:
        line = f"{attempt['category']} - Level {attempt['level']} - Attempt {attempt['attempt']} - {attempt['points']} pts"
        total_points += attempt['points']
        pdf.cell(200, 10, txt=line, ln=True)

    pdf.cell(200, 10, txt=f"Total Points: {total_points}", ln=True)

    filename = f"{username}_{start_date}_{end_date}.pdf".replace(":", "-")
    path = f"reports/{filename}"
    os.makedirs("reports", exist_ok=True)
    pdf.output(path)
    return path
