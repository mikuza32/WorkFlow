"use client"


import Head from "next/head";
import { Montserrat } from "next/font/google";
import Navbar from "./navbar/page";
import Image from 'next/image';
import { useRouter } from "next/navigation";
import { useState } from 'react';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-montserrat',
})

export default function LandingPage() {

  const router = useRouter();

  const faqs = [
    {
      question: 'What is this app for?',
      answer: 'The purpose of this app is to service users with music that can help them stay focused to help increase productivity and decrease stress.'
    },
    {
      question: 'How can I organize my music?',
      answer: 'The purpose of this app is to service users with music that can help them stay focused to help increase productivity and decrease stress.'
    },
    {
      question: 'What genres can I listen to?',
      answer: 'The purpose of this app is to service users with music that can help them stay focused to help increase productivity and decrease stress.'
    },
    {
      question: 'Are there premade playlists?',
      answer: 'The purpose of this app is to service users with music that can help them stay focused to help increase productivity and decrease stress.'
    },
    {
      question: 'Who is the developer of this application?',
      answer: 'The purpose of this app is to service users with music that can help them stay focused to help increase productivity and decrease stress.'
    },
  ]

  const [openIndex, setOpenIndex] = useState(null);
  const toggleFAQs =  (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  



  return (
    <div className="min-h-screen" style={{ backgroundColor: "#DDD0C8", color: "#323232"}}>
      <Head>
        <title>WorkFlow</title>
        <meta name="greeting" content="WorkFlow App Landing Page"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>
      <header className="flex items-center justify-between p-4">
        <Navbar />
      </header>

      <section className="pt-28 px-10" id="home" data-aos="fade-left">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="max-w-xl bg-white/10 p-6 rounded-lg shadow-md backdrop-blur-lg">
            <h1 className={`text-5xl font-extrabold text-left mb-4 ${montserrat.variable} font-montserrat`}>
              Music to help you improve your WorkFlow. Try it out now for free!
            </h1>
            <div className="flex items-center space-x-3">
              <button
                style={{ backgroundColor: '#DDD0C0' }}
                className="border rounded-xl px-8 py-1 hover:text-stone-500 transition"
                onClick={() => router.push('/Signup')}
              >
                Get Started
              </button>
              <button
                style={{ backgroundColor: '#000000' }}
                className="text-white border rounded-xl px-8 py-1 hover:text-stone-500 transition"
              >
                Learn More
              </button>
            </div>
          </div>
          <div className="ml-10">
            <Image
              src="/1.png" 
              alt="Workflow Logo"
              width={300}
              height={300}
              className="rounded-xl"
            />
          </div>
        </div>
      </section>
      <section className="py-20 px-6 text-center" id="about" data-aos="fade-up">
        <h1 className="text-4xl font-bold font-montserrat mb-12">How does music in the workplace help achieve WorkFlow?</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 max-w-5xl mx-auto ">
          <div className="flex flex-col items-center ">
            <img
              src="/The Impact of Music in the Workplace on Productivity and Mental Health - visual selection.png"
              alt="Image 1"

              className= "rounded-lg shadow-md max-w-lg bg-stone-600 hover:scale-105 transition-transform" data-aos="fade-right"
            />
          </div>
          <div className="flex flex-col items-center">
            <img
              src="/The Impact of Music in the Workplace on Productivity and Mental Health - visual selection(1).png"
              alt="Image 1"

              className= "rounded-lg shadow-md max-w-lg bg-stone-600 hover:scale-105 transition-transform"
            />
          </div>
          <div className="flex flex-col items-center">
            <img
              src="/The Impact of Music in the Workplace on Productivity and Mental Health - visual selection(2).png"
              alt="Image 1"

              className= "rounded-lg shadow-md max-w-lg bg-stone-600 hover:scale-105 transition-transform" data-aos="fade-left"
            />
          </div>
          <div className="flex flex-col items-center">
            <img
              src="/The Impact of a Workplace Music Application on Productivity and Employee Mental Health - visual selection.png"
              alt="Image 1"

              className= "rounded-lg shadow-md max-w-lg bg-stone-600 hover:scale-105 transition-transform" data-aos="fade-down"
            />
          </div>
        </div>
      </section>
      <section className="py-20 px-6" style={{ backgroundColor: "#DDD0C8", color: "#323232"}} id="faqs" data-aos="fade-up">
        <h2 className="text-4xl font-bold font-montserrat text-center mb-12">
          Frequently Asked Questions
        </h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="border border-black rounded-lg overflow-hidden shadow-sm"
            >
              <button 
                onClick={() => toggleFAQs(index)}
                className="w-full text-left px-6 py-4 font-semibold text-lg flex justify-between items-center hover:bg-gray-100 transition"
              >
                {faq.question}
                <span className="ml-2 text-2xl">
                  {openIndex === index ? '-' : <img
                    src="/icons8-down-arrow-50.png"
                    alt="Down arrow" 
                  />
                  }

                </span>
              </button>
              <div className={`px-6 text-sm transition-all duration-300 ease-in-out bg-white ${openIndex === index ? 'block' : 'hidden'}`}>
                {faq.answer}
              </div>
            </div>
          ))}
        </div>
      </section>
      <footer className="py-10 mt-20">
          <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 sm:mb-0">
              <Image src="/2.png" alt="Workflow logo 2" width={40} height={40} />
              <span className="text-xl font-bold">WorkFlow</span>
            </div>
            <nav className="flex space-x-6">
              <a href="/#" className="hover:text-stone-600 transition">Home</a>
              <a href="#about" className="hover:text-stone-600 transition">About</a>
              <a href="#faqs" className="hover:text-stone-600 transition">FAQs</a>
              <a href="/Login" className="hover:text-stone-600 transition">Log in</a>
              <a href="/Signup" className="hover:text-stone-600 transition">Sign up</a>
            </nav>
          </div>
      </footer>
    </div>
  )

}
