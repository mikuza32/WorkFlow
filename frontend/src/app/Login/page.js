"use client"

import { Montserrat } from "next/font/google"
import { useState } from 'react'
import { useRouter } from "next/navigation"
import axios from 'axios'

const montserrat = Montserrat({
    subsets: ['latin'],
    weight: ['400', '600', '700'],
    variable: '--font-montserrat',
  })


export default function LogIn() {

    const router = useRouter()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');


    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:8000/login", {
                email,
                password,
            });
            if (res.data?.userId) {
                localStorage.setItem('userId', res.data.userId);
                alert(res.data.message);
                router.push('/HomePage');
            } else {
                setError('User ID cannot be found');
            }
        } catch (err) {
            setError(err.response?.data?.detail || 'Could not login successfully')
        }
    }

    


    return (
        <main className="min-h-screen flex flex-col items-center justify-center px-4" style={{ backgroundColor: "#DDD0C8", color: "#323232"}}>
            <div className="mb-8">
                <h1 className= {`text-5xl font-semibold mb-2 ${montserrat.variable} font-montserrat`}>WorkFlow</h1>
                <h2 className="text-lg mb-6">Music that helps you focus.</h2>
            </div>
            <div className="backdrop-blur-xl rounded-xl shadow-lg p-8 max-w-md w-full" style={{ backgroundColor: "#DDD0C0"}}>
                <h2 className="text-3xl font-bold mb-6 text-center font-montserrat">
                    Log in to Workflow
                </h2>
                {error && <p className="text-center text-red-600 text-md mb-5">{error}</p>}
                <form className="space-y-4" onSubmit={handleLogin}>
                    <div>
                        <label htmlFor="email" className="block mb-1">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="test123@gmail.com"
                            className="w-full px-4 py-2 rounded bg-white/20 placeholder-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-300"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block mb-1">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-4 py-2 rounded bg-white/20 placeholder-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-300"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-stone-600 text-white font-bold py-2 rounded hover:bg-lime-500 transition cursor-pointer"
                    >
                        Log in
                    </button>
                </form>
                <p className="mt-4 text-center text-xs" style={{color: "#323232"}}>
                    Don't have an account with WorkFlow? {' '}
                    <a href="/Signup" className="hover:underline" style={{color: "#323232"}}>Sign up</a>
                </p>
            </div>
        </main>
        
    )
}