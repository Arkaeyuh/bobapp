"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { useCart} from '@/components/cartContext'
import { translatePage } from "@/components/googleTranslateFunction";

export default function checkoutPage() {
  const {language}  = useCart()

  // Structure of an item in the cart
  // { id: number; name: string; price: number; quantity: number; ingredients: Ingredient[]; }

  // Translate the page into the user's currently selected language on mount.
  useEffect(()=>{
      translatePage(language)
    },[])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <Image
        src="/ole_sarge.jpg"
        alt="Other"
        width={450}
        height={200}
        className="rounded-md mb-4 object-cover"
      />
      <h1 className="text-4xl font-bold mb-4 text-black">Ole Sarge approves of your order. You're a good Ag!</h1>
      <button 
        onClick={() => signOut({ callbackUrl: "/" })}
        className="bg-red-900 text-white text-2xl py-2 px-4 rounded-lg hover:bg-red-800"
      >
        <p>Return to Home</p>
      </button>
    </div>
  );
}