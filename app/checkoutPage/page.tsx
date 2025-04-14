"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart, Item, Ingredient} from '@/components/cartContext'
import MailRu from "next-auth/providers/mailru";

export default function checkoutPage() {
  const {cart, addToCart, removeFromCart}  = useCart()

  // Structure of an item in the cart
  // { id: number; name: string; price: number; quantity: number; ingredients: Ingredient[]; }

  interface Ingredient {
    ingredientid: number;
    name: string;
  }
  

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
      <Link href="/home" className="bg-red-900 text-white text-2xl py-2 px-4 rounded-lg hover:bg-red-800">
        Return to Home
      </Link>
    </div>
  );
}