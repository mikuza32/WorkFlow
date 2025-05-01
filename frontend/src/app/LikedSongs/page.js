"use client"

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Link from 'next/link'
import SideBar from "../SideBar/page";
import {FaHeart} from 'react-icons/fa';



export default function LikedSongs() {
    const [likedSongs, setLikedSongs] = useState([]);
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const audioRef = useRef(null);
    

    const userId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchLikedSongs = async () => {
            try {
                if (!userId) {
                    window.location.href = "/Login";
                    return;
                }
                const res = await axios.get(`http://localhost:8000/liked_songs/${userId}`);
                setLikedSongs(res.data);
            } catch (err) {
                console.log("Could not fetch liked songs!", err);
            }
        };
        fetchLikedSongs();

    }, [userId]);

    const handleLike = async (songId) => {
        const userId = localStorage.getItem("userId");
    
        
        if (!userId) {
            setMessage("Please log in to like songs.");
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 2000);
            return;
        }
    
        try {
            const response = await axios.post("http://localhost:8000/like_songs", {
                user_id: userId,
                song_id: songId
            });
            setLikedSongs((prev) => [...prev, songId]);
            setMessage(response.data.message);
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 2000);
        } catch (err) {
            console.error("Could not like song:", err);
            setMessage("Could not like song!");
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 2000);
        }
    };

    const handleUnlike = async (songId) => {
        const userId = localStorage.getItem("userId");

        if (!userId) {
            setMessage("Please login to unlike songs");
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 2000);
            return;
        }

        try {
            const response = await axios.post("http://localhost:8000/unlike_songs", {
                user_id: userId,
                song_id: songId
            });
            setLikedSongs((prev) => prev.filter((id) => id !== songId));
            setMessage(response.data.message);
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 2000);
        } catch (err) {
            console.error("Could not unlike song: ", err);
            setMessage("Could not unlike song!");
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 2000);
        }
    };

    useEffect(() => {
        if (audioRef.current) {
            const audio = audioRef.current;
            audio.ontimeupdate = () => {
                setCurrentTime(audio.currentTime);
            };
            audio.onloadedmetadata = () => {
                setDuration(audio.duration);
            };
            if (isPlaying) {
                audio.play().catch((err) => {
                    console.error("Could not load audio: ", err);
                });
            }
        }
    }, [currentSongIndex, isPlaying])

    const handlePlayAndPause = () => {
        if (audioRef.current.paused) {
            audioRef.current.play().catch((err) => {
                console.error("COuld not load audio: ", err)
            });
            setIsPlaying(true);
        } else {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    };

    const handleNext = () => {
        audioRef.current.pause();
        setIsPlaying(false);
        setCurrentSongIndex((prevIndex) => {
            const nextIndex = (prevIndex + 1) % likedSongs.length;
            return nextIndex;
        });
        setIsPlaying(true);
        audioRef.current.play();
    };
    
    const handlePrev = () => {
        audioRef.current.pause();
        setIsPlaying(false);
        setCurrentSongIndex((prevIndex) => {
            const prevSongIndex = (prevIndex === 0 ? likedSongs.length - 1 : prevIndex - 1);
            return prevSongIndex;
        });
        setIsPlaying(true);
        audioRef.current.play();
    };
    

    const handleVolume = (event) => {
        const newVolume = event.target.value;
        setVolume(newVolume);
        audioRef.current.volume = newVolume;
    };

    const handleSeek = (event) => {
        const newTime = event.target.value;
        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    };
    
    const handleClick = (index) => {
        setCurrentSongIndex(index);
        setIsPlaying(true);
        audioRef.current.play();
    };


    return (
        <div className="min-h-screen bg-[#DDD0C8] font-montserrat flex">
            <SideBar/>
            <div className="flex-1 p-6">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-500 text-white p-10 flex flex-col items-center">
                    <div className="text-5xl font-bold mb-4">Liked Songs</div>
                    <div className="text-xl">{likedSongs.length} songs</div>
                </div>
                <div className="overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left text-gray-700">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                            <tr>
                                <th scope="col" className="px-6 py-3">#</th>
                                <th scope="col" className="px-6 py-3">Title</th>
                                <th scope="col" className="px-6 py-3">Artist</th>
                                <th scope="col" className="px-6 py-3">Date Added</th>
                            </tr>
                        </thead>
                        <tbody>
                            {likedSongs.map((song, index) => (
                                <tr key={song._id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-3 cursor-pointer hover:text-gray-700" onClick={() => handleClick(index)}>{index + 1}</td>
                                    <td className="px-6 py-3 flex items-center">
                                        <img src={song.image_url} alt={song.title} className="w-10 h-10 object-cover mr-3 rounded-full"/>
                                        {song.title}
                                    </td>
                                    <td className="px-6 py-3">{song.artist}</td>
                                    <td className="px-6 py-3">
                                        <FaHeart
                                            className={`cursor-pointer ${likedSongs.includes(song._id) ? 'text-pink-600' : 'text-gray-500'}`}
                                            onClick={() => likedSongs.includes(song._id) ? handleUnlike(song._id) : handleLike(song._id)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="fixed bottom-0 w-full bg-black flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button onClick={handlePrev} className="text-white text-3xl">⬅️</button>
                    <button onClick={handlePlayAndPause} className="text-white p-3 rounded-full bg-black hover:bg-gray-800 text-xl transition">
                        {isPlaying ? '⏸️' : '▶️'}
                    </button>
                    <button onClick={handleNext} className="text-white text-3xl">➡️</button>
                </div>
                <div className="flex items-center space-x-4">
                    <p className="text-white">{likedSongs[currentSongIndex]?.title}</p>
                    <audio ref={audioRef} src={likedSongs[currentSongIndex]?.audio_url} className="w-48" />
                </div>
                <div className="flex items-center">
                    <input
                        type="range"
                        min="0"
                        max={duration}
                        step="0.1"
                        value={currentTime}
                        onChange={handleSeek}
                        className="w-20"
                    />
                    <input 
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={volume}
                        onChange={handleVolume}
                        className="w-20"
                    />
                </div>
            </div>
        </div>
    )
}