from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class UserRegister(BaseModel):
    username: str
    password: str
    confirm_password: str
    realname: str
    email: EmailStr
    language: str
    school: str
    standard: str
    board: str
    country: str
    state: str
    city: str
    usertype: str = "user"

class UserLogin(BaseModel):
    username: str
    password: str

class AttemptData(BaseModel):
    username: str
    category: str
    level: int
    attempt: int
    points: int

class UploadMeta(BaseModel):
    uploader: str
    category: str
    pages: int

from datetime import date

class ReportRequest(BaseModel):
    username: str
    start_date: date
    end_date: date
    send_email: Optional[bool] = False
