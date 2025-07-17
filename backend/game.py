from fastapi import APIRouter
from schemas import AttemptData
from database import attempts_collection
from datetime import datetime

router = APIRouter()

@router.post("/attempt")
def record_attempt(data: AttemptData):
    record = data.dict()
    record["timestamp"] = datetime.now()
    attempts_collection.insert_one(record)
    return {"msg": "Attempt saved"}
