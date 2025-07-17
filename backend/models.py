from database import users_collection, levels_collection
from werkzeug.security import generate_password_hash, check_password_hash

def register_user(data):
    if users_collection.find_one({"username": data.username}):
        return {"error": "Username already exists"}
    if not data.password == data.confirm_password:
        return {"error": "Passwords do not match"}
    if not is_valid_email(data.email):
        return {"error": "Email must end with @gmail.com or @yahoo.com"}

    hashed_pw = generate_password_hash(data.password)
    user_doc = data.dict()
    user_doc["password"] = hashed_pw
    del user_doc["confirm_password"]
    user_doc["created_at"] = user_doc["updated_at"] = datetime.now()
    user_doc["coins"] = 0
    users_collection.insert_one(user_doc)
    return {"msg": "User registered successfully"}

def login_user(data):
    user = users_collection.find_one({"username": data.username})
    if user and check_password_hash(user["password"], data.password):
        return {"msg": "Login successful", "usertype": user["usertype"]}
    return {"error": "Invalid credentials"}

def is_valid_email(email):
    return email.endswith("@gmail.com") or email.endswith("@yahoo.com")
