"use client"

import Image from 'next/image'
import { useEffect, useState } from "react"
import AOS from 'aos'
import 'aos/dist/aos.css'
import {useRouter} from 'next/navigation'


export default function Navbar() {

    useEffect(() => {
        AOS.init({duration: 800})
    }, [])

    const scrollToSection = (id) => {
        const section = document.getElementById(id)
        if (section) {
            section.scrollIntoView({behavior: 'smooth'})
        }
    }

    const [isVisible, setIsVisible] = useState(true);
    useEffect(() => {
        let lastScrollY = window.scrollY

        const handleScroll = () => {
            if (window.scrollY > lastScrollY && window.scrollY > 50) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
            lastScrollY = window.scrollY
        }
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }

    }, [])

    const router = useRouter();



    return (
        <nav className={`fixed top-0 left-0 w-full bg-black/80 backdrop-blur-lg shadow-md z-50 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between text-white">
                <div className="flex items-center space-x-3">
                    <Image src="/2.png" alt="WorkFlow Logo 2" width={70} height={60} />
                    <span className="text-xl font-bold">WorkFlow</span>
                </div>

                <div className="flex items-center space-x-6">
                    <button
                        onClick={() => scrollToSection('about')} className="hover:text-stone-500 transition colors duration-200"
                    >
                        About
                    </button>
                    <button
                        onClick={() => scrollToSection('faqs')} className="hover:text-stone-500 transition colors duration-200"
                    >
                        FAQs
                    </button>

                    <button className="bg-transparent border border-white rounded px-4 py-1 hover:text-stone-500 transition" onClick={() => router.push('/Login')}>
                        Log in
                    </button>
                    <button className="bg-transparent border border-white rounded px-4 py-1 hover:text-stone-500 transition" onClick={() => router.push('/Signup')}>
                        Sign up
                    </button>
                </div>
            </div>
        </nav>
    )
}