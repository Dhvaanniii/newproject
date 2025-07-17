from fastapi import APIRouter
from schemas import UserRegister, UserLogin
from models import register_user, login_user

router = APIRouter()

@router.post("/register")
def register(data: UserRegister):
    return register_user(data)

@router.post("/login")
def login(data: UserLogin):
    return login_user(data)
