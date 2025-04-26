"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { translatePage } from "@/components/googleTranslateFunction";
import { useCart} from '@/components/cartContext'

export default function HomePage() {
  const {language}  = useCart()
  
  // Translate the page into the user's currently selected language on mount.
  useEffect(()=>{
      translatePage(language)
    },[])

  return (
    <>
      <title>TeaShare - Item Category Selection</title>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        {/* Header */}
        <header className="w-full bg-red-700 text-white py-6 mb-4 grid grid-cols-3 items-center px-6">
          {/* Left column  */}
          <div className="flex justify-start">
            {/*//TODO: Make this an icon*/} 
            <Link 
              href="/orderSummary" 
              className="bg-gray-200 text-2xl text-black hover:bg-gray-300 transition py-3 px-6 rounded-lg shadow-md"
            >
              Checkout
            </Link>
          </div>

          {/* Center column  */}
          <div className="text-center">
            <h1 className="text-4xl font-bold">Welcome to TeaShare</h1>
            <p className="mt-2 text-lg">Your favorite bubble tea destination!</p>
          </div>

          {/* Right column  */}
          <div className="flex justify-end">
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="bg-red-200 text-2xl text-black hover:bg-red-100 transition py-3 px-6 rounded-lg shadow-md"
            >
              Sign Out
            </button>
          </div>
        </header>

        <main className="flex flex-col items-center mt-10 px-4">
          <h2 className="text-2xl font-semibold mb-4 text-black">Our Specialties</h2>
          {/* //TODO: delete this later if we dont need to use */}
          {/* <div className="text-center mb-8 text-gray-700">
            Manager Page Link
            <Link href="/managerHome">
              <p className="text-red-700 hover:underline">Manager Page</p>
            </Link>
            Order Summary Link
            <Link href="/orderSummary">
              <p className="text-red-700 hover:underline">Go to Checkout</p>
            </Link>
          </div> */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Milk Tea */}
            <Link href={{ pathname: "/itemSelection", query: { category: "Tea" } }}>
              <div className="cursor-pointer bg-white p-6 rounded-lg shadow-md text-center transform transition-transform duration-300 hover:scale-105">
                <Image
                  src="/Pearl+Milk+Tea.jpg"
                  alt="Milk Tea"
                  width={450}
                  height={200}
                  className="rounded-md mb-4 object-cover"
                />
                <h3 className="text-xl font-bold mb-2 text-black">Milk Tea</h3>
                <p className="text-gray-700">A perfect blend of tea and milk with chewy tapioca pearls.</p>
              </div>
            </Link>

            {/* Ice Blended */}
            <Link href={{ pathname: "/itemSelection", query: { category: "Ice Blended" } }}>
              <div className="cursor-pointer bg-white p-6 rounded-lg shadow-md text-center transform transition-transform duration-300 hover:scale-105">
                <Image
                  src="/test+ice+blended.jpg"
                  alt="Ice Blended"
                  width={450}
                  height={200}
                  className="rounded-md mb-4 object-cover"
                />
                <h3 className="text-xl font-bold mb-2 text-black">Ice Blended</h3>
                <p className="text-gray-700">Refreshing tea infused with real fruit flavors blended with ice.</p>
              </div>
            </Link>

            {/* Other */}
            <Link href={{ pathname: "/itemSelection", query: { category: "Other" } }}>
              <div className="cursor-pointer bg-white p-6 rounded-lg shadow-md text-center transform transition-transform duration-300 hover:scale-105">
                <Image
                  src="/test_new.jpg"
                  alt="Other"
                  width={450}
                  height={200}
                  className="rounded-md mb-4 object-cover"
                />
                <h3 className="text-xl font-bold mb-2 text-black">Other</h3>
                <p className="text-gray-700">Our other tea-based products.</p>
              </div>
            </Link>
          </div>
        </main>

        <footer className="w-full bg-red-700 text-white py-4 mt-10">
          <p className="text-center">© 2025 ShareTea. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}