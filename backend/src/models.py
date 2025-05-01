from pydantic import BaseModel, EmailStr, HttpUrl
from bson import ObjectId
from typing import List, Optional

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    liked_songs: Optional[List[str]] = []

    class Config:
        json_encoders = {
            ObjectId: str
        }

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Song(BaseModel):
    title: str
    artist: str
    genre: str
    image_url: HttpUrl
    audio_url: HttpUrl