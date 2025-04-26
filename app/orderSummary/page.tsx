"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useCart} from "@/components/cartContext";
import { useRouter } from "next/navigation";
import { translatePage } from "@/components/googleTranslateFunction";

export default function OrderSummary() {
  const {cart, removeFromCart, clearCart, language}  = useCart()
  const router = useRouter();

  // Translate the page into the user's currently selected language on mount
  useEffect(()=>{
    translatePage(language)
  },[])

  // Structure of an item in the cart
  // { id: number; name: string; price: number; quantity: number; ingredients: Ingredient[]; }
  
  const handleCheckout = async () => {
    // Do nothing if cart is empty
    if (cart.length ===0 ) return;

    // Send cart to backend
    try {
      const result = await fetch("/api/updateInventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cart),
      });
  
      if (result.ok) {
        alert("Ingredients updated!");
        // Optionally clear cart or redirect
      } else {
        alert("Error updating stock.");
      }
    } catch (err) {
      console.error("Checkout error:", err);
    }

    clearCart();
    router.push('/checkoutPage');
  };
  

  return (
    <div className="flex flex-col items-center p-6 min-h-screen bg-gray-100">
      {/* Total Price */}
      <div className="w-64 h-17 bg-gray-300 text-black text-3xl font-bold py-4 text-center rounded-lg items-center">
        ${cart.reduce((sum, item) => sum + item.quantity * parseFloat(item.price), 0).toFixed(2)}
      </div>

      {/* Order List */}
      <div className="mt-4 w-2xl h-3/4 bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="max-h-100 overflow-y-auto">
          {cart.map((item) => (
            <div key={item.itemid} className="flex justify-between items-center border-b px-4 py-3">
              {/* Item Details */}
              <div className="flex flex-col">
                <span className="font-semibold text-gray-800">{item.name}</span>
              </div>

              {/* Quantity */}
              <span className="font-bold text-lg">x{item.quantity}</span>

              {/* Remove Button */}
              <button
                onClick={() => removeFromCart(cart.findIndex(i => i.itemid === item.itemid))}
                className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
              >
                ✖
              </button>
            </div>
          ))}
        </div>

        {/* Scroll Indicator (only shows if there are > 5 items) */}
        {cart.length > 5 && (
          <div className="bg-gray-700 text-white text-center py-2 text-sm">
            <p>Scroll to see more ▼</p>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-between w-full h-50 items-center mt-auto">
        <Link 
          href="/home" 
          className="flex bg-red-700 text-white text-3xl text-center items-center w-1/6 h-1/2 py-2 px-4 rounded-lg hover:bg-red-800">
            <p>Back to Selection</p>
        </Link>
        <button 
          onClick={handleCheckout} 
          className="flex bg-green-700 text-white text-3xl text-center items-center w-1/6 h-1/2 py-2 px-4 rounded-lg hover:bg-green-800">
            Complete Order
        </button>
      </div>
    </div>
  );
}