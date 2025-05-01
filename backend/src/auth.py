from fastapi import APIRouter, HTTPException, status
from models import UserCreate, UserLogin
from databaseIntegration import users_collection
import bcrypt


router = APIRouter()

@router.post("/signup")
async def signup(user: UserCreate):
    existing_user = await users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email entered already exists")
    hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())
    await users_collection.insert_one({
        "email": user.email,
        "password": hashed_password
    })

    return {"message": "Account created successfully!"}

@router.post("/login")
async def login(user: UserLogin):
    existing_user = await users_collection.find_one({"email": user.email})
    if not existing_user:
        raise HTTPException(status_code=401, detail="Account does not exist")
    if not bcrypt.checkpw(user.password.encode('utf-8'), existing_user["password"]):
        raise HTTPException(status_code=401, detail= "Account does not exist")
    
    return {"message": "Login successful", "userId": str(existing_user["_id"])}