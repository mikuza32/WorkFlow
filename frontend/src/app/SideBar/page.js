"use client"

import { useState } from 'react';
import Link from "next/link";


const SideBar = () => {
    return (
        <aside className="w-64 bg-black text-white p-6 space-y-6">
            <div className='space-y-3'>
                <div>
                    <ul className='space-y-2 mt-2 text-lg font-bold text-white'>
                        <li className='rounded px-2 py-1 hover:text-gray-700'>
                            <Link href='/HomePage'>Home</Link>
                        </li>
                        <li className='rounded px-2 py-1 hover:text-gray-700'>
                            <Link href='/LikedSongs'>Liked Songs</Link>
                        </li>
                    </ul>
                </div>
                <div>
                    <h3 className='uppercase text-md mt-6 font-bold font-montserrat'>Playlists</h3>
                    <ul className='space-y-2 mt-2'>
                        <li className='rounded px-2 py-1'>Relaxing</li>
                        <li className='rounded px-2 py-1'>Relaxing</li>
                        <li className='rounded px-2 py-1'>Relaxing</li>
                    </ul>
                </div>
                <div>
                    <h3 className="uppercase text-md mt-6 font-bold">Liked Playlists</h3>
                    <ul className="space-y-2 mt-2">
                        <li className="rounded px-2 py-1">Relax Mix</li>
                    </ul>
                </div>
                <div className='mt-auto'>
                    <button 
                        className='w-full bg-red-500 text-white font-bold font-montserrat rounded-lg hover:bg-red-800 transition'
                        onClick={() => {
                            localStorage.removeItem("userId");
                            window.location.href = "/";
                        }}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default SideBar;