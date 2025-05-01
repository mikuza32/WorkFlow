"use client"


import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Montserrat } from "next/font/google";
import axios from 'axios';
import Link from 'next/link';
import {FaHeart} from 'react-icons/fa';

const montserrat = Montserrat({
    subsets: ['latin'],
    weight: ['400', '600', '700'],
    variable: '--font-montserrat',
  })

export default function HomePage() {
    const [user, setUser] = useState([]);
    const [songs, setSongs] = useState([]);
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [likedSongs, setLikedSongs] = useState([]);
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');
    const audioRef = useRef(null);
    const router = useRouter()

    const userId = localStorage.getItem("userId");

    useEffect(() => {
        
        if (!userId) {
            router.push('/Login');  
        } else {
            const fetchSongs = async () => {
                try {
                    const res = await axios.get("http://localhost:8000/getsongs");
                    setSongs(res.data);
                    console.log(userId);
                } catch (err) {
                    console.error("Error fetching music: ", err);
                }
            };

            const fetchLikedSongs = async () => {
                if (userId) {
                    try {
                        const res = await axios.get(`http://localhost:8000/liked_songs/${userId}`);
                        setLikedSongs(res.data.map((song) => song._id));
                    } catch (err) {
                        console.error("Could not fetch liked songs: ", err);
                    }
                }
            };

            fetchSongs();
            fetchLikedSongs();
        }
    }, [userId, router]);

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

    const handleLogout = () => {
        localStorage.removeItem("userId");
        router.push("/");
    };

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
        setCurrentSongIndex((prevIndex) => {
            const nextIndex = (prevIndex + 1) % songs.length;
            audioRef.current.src = songs[nextIndex]?.audio_url;
            audioRef.current.load();
            audioRef.current.play();

            return nextIndex;
        });
    };
    
    const handlePrev = () => {
        audioRef.current.pause();
        setCurrentSongIndex((prevIndex) => {
            const prevSongIndex = (prevIndex === 0 ? songs.length - 1 : prevIndex - 1);
            audioRef.current.src = songs[prevSongIndex]?.audio_url;
            audioRef.current.load();
            audioRef.current.play();

            return prevSongIndex;
        });
    };

    const handleVolume = (event) => {
        const newVolume = event.target.value;
        setVolume(newVolume);
        audioRef.current.volume = newVolume;
    };


    return (
        <div className="min-h-screen flex font-montserrat" style={{ backgroundColor: "#DDD0C8", color: "#323232"}}>
            <aside className="w-64 bg-black text-white p-6 space-y-6">
                <div className="space-y-3">
                <div>
                    <ul className="space-y-2 mt-2 text-lg font-bold text-white">
                        <li className="rounded px-2 py-1 hover:text-gray-600">
                            <Link href='/HomePage'>
                                Home
                            </Link>
                        </li>
                    </ul>
                </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold">Search</span>
                    </div>
                </div>
                <div>
                    <h3 className="uppercase text-md mt-6 font-bold font-montserrat">Playlists</h3>
                    <ul className="space-y-2 mt-2">
                        <li className="rounded px-2 py-1">Relaxing</li>
                        <li className="rounded px-2 py-1">Pump-up</li>
                        <li className="rounded px-2 py-1">Relaxing</li>
                    </ul>
                </div>
                <div>
                    <h3 className="uppercase text-md mt-6 font-bold">Liked Playlists</h3>
                    <ul className="space-y-2 mt-2">
                        <li className="rounded px-2 py-1">Relax Mix</li>
                    </ul>
                </div>
                <div>
                    <ul className="space-y-2 mt-2 text-lg font-bold text-white">
                        <li className="rounded px-2 py-1 hover:text-gray-600">
                            <Link href='/LikedSongs'>
                                Liked Songs
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="mt-auto">
                    <button 
                        onClick={handleLogout}
                        className="w-full bg-red-500 text-white font-bold font-montserrat rounded-lg hover:bg-red-300 transition"
                    >
                        Logout
                    </button>
                </div>
            </aside>
            <main className="p-8 flex-1">
                <h1 className="text-3xl font-bold mb-6">Welcome, {user.email}!</h1>
                {showMessage && <div className="popup">{message}</div>}

        
                <div className="grid grid-cols-3 gap-6">
                    {songs.map((song) => (
                        <div key={song._id} className="bg-white/70 backdrop-blur-md p-4 rounded-lg shadow-md">
                            <img src={song.image_url} alt={song.title} className="w-full h-40 object-cover rounded mb-4" />
                            <h2 className="text-xl font-bold">{song.title}</h2>
                            <p className="text-gray-700">{song.artist} • {song.genre}</p>

                            <div className="flex justify-between items-center mb-4">
                                <audio controls className="w-full mt-3">
                                    <source src={song.audio_url} type="audio/mp3" />
                                </audio>
                                <div className="flex space-x-4">
                                    <FaHeart
                                        className={`cursor-pointer ${likedSongs.includes(song._id) ? 'text-pink-600' : 'text-gray-500'}`}
                                        onClick={() => likedSongs.includes(song._id) ? handleUnlike(song._id) : handleLike(song._id)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}