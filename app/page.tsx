"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import {translatePage} from '@/components/googleTranslateFunction'
import { useCart} from '@/components/cartContext'
import LanguagePicker from "@/components/languagePicker";

export default function KioskLandingPage() {
  const {language, changeLanguage}  = useCart()
  const [prevLanguage, changePrevLanguage] = useState<string>(language)

  // Whenever enter the landing page, set the language back to its default of english
  useEffect(()=>{
    changeLanguage("en")
  },[])

  // When the language changes, retranslate the page
  useEffect(()=>{
    console.log("language changed to "+language+" from "+prevLanguage)
    if(prevLanguage!=language && language=='en')
      translatePage(language, prevLanguage, true)
    else
      translatePage(language, prevLanguage)
    changePrevLanguage(language)
  },[language])

  const handlePageClick = () => {
    // Direct the guest user to the main/home page.
    window.location.href = "/home";
  };

  return (
    <div
      onClick={handlePageClick}
      className="relative flex flex-col items-center justify-center min-h-screen bg-gray-100 cursor-pointer"
    >
      {/* Register Link */}
      <div className="absolute top-12 left-8" onClick={(e) => e.stopPropagation()}>
        <Link href="/signup">
          <span className="px-16 py-8 bg-red-700 text-white text-2xl font-bold rounded-xl hover:bg-red-900 shadow-xl">
            Register
          </span>
        </Link>
      </div>

      {/* Login Link */}
      <div className="absolute top-12 right-8" onClick={(e) => e.stopPropagation()}>
        <Link href="/login">
          <span className="px-16 py-8 bg-red-700 text-white text-2xl font-bold rounded-xl hover:bg-red-900 shadow-xl">
            Login
          </span>
        </Link>
      </div>

      {/* Main Content */}
      <div className="text-center border-12 rounded-xl p-8 m-8">
        <h1 className="text-6xl font-bold mb-4 text-black">
          Welcome to TeaShare
        </h1>
        <p className="text-3xl text-black">Sign in, or click anywhere to order</p>
      </div>
      
      {/* Language Selector */}
      <LanguagePicker/>
    </div>
  );
}