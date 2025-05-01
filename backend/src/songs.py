from fastapi import APIRouter, HTTPException, Request
from fastapi.encoders import jsonable_encoder
from models import Song
from databaseIntegration import db, users_collection, songs_collection
from bson import ObjectId

router = APIRouter()
songs_collection = db["songs"]


@router.post("/addsongs")
async def add_song(song: Song):
    song_dict = song.model_dump()
    song_dict["image_url"] = str(song.image_url)
    song_dict["audio_url"] = str(song.audio_url)

    result = await songs_collection.insert_one(song_dict)
    return {"message": "Song added", "id": str(result.inserted_id)}

@router.get("/getsongs")
async def get_song():
    songs = await songs_collection.find().to_list(length=100)
    for song in songs:
        song["_id"] = str(song["_id"])
    return songs

@router.post("/like_songs")
async def like_songs(request: Request):
    try:
        body = await request.json()
        user_id = body.get("user_id")
        song_id = body.get("song_id")

        if not user_id or not song_id:
            raise HTTPException(status_code=422, detail="User ID and Song ID are required!")
        
        try:
            user_object_id = ObjectId(user_id)
            song_object_id = ObjectId(song_id)
        except Exception as e:
            raise HTTPException(status_code=400, detail="Invalid Object ID format")
        
        user = await users_collection.find_one({"_id": user_object_id})
        if not user:
            raise HTTPException(status_code=404, detail="User could not be found!")
        
        if song_id not in user.get("liked_songs", []):
            await users_collection.update_one(
                {"_id": user_object_id},
                {"$push": {"liked_songs": song_id}}
            )
            return {"message": "Song liked!"}
        else: 
            raise HTTPException(status_code=400, detail="Song has already been liked")
    except Exception as e:
        raise HTTPException(status_code=500, detail="Server error: " + str(e))
    
    

@router.get("/liked_songs/{user_id}")
async def get_liked_songs(user_id: str):
    try:
        user_object_id = ObjectId(user_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid user ID format")
    
    user = await users_collection.find_one({"_id": user_object_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found!")
    
    liked_song_ids = user.get("liked_songs", [])
    songs = await songs_collection.find({"_id": {"$in": [ObjectId(song_id) for song_id in liked_song_ids]}}).to_list(None)

    for song in songs:
        song["_id"] = str(song["_id"])
    
    return jsonable_encoder(songs)



@router.post("/unlike_songs")
async def unlike_songs(request: Request):
    try: 
        body = await request.json()
        user_id = body.get("user_id")
        song_id = body.get("song_id")

        if not user_id or not song_id:
            raise HTTPException(status_code=422, detail="User ID and Song ID are required!")
        
        try: 
            user_object_id = ObjectId(user_id)
            song_object_id = ObjectId(song_id)
        except Exception as e:
            raise HTTPException (status_code=400, detail="Invalid ObjectId format")
        
        user = await users_collection.find_one({"_id": user_object_id})
        if not user:
            raise HTTPException(status_code=404, detail="Could not find user")
        
        if song_id in user.get("liked_songs", []):
            await users_collection.update_one(
                {"_id": user_object_id},
                {"$pull": {"liked_songs": song_id}}
            )
            return {"message": "Song has been unliked!"}
        else:
            raise HTTPException(status_code=400, detail="Song is not liked!")
    except Exception as e:
        raise HTTPException(status_code=500, detail="Server error: " + str(e))