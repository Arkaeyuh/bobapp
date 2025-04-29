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
      // Get the current time
      const currentTime = new Date()
      const options: Intl.DateTimeFormatOptions = {
        hour12:false,
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      }
      let currentTimeString = currentTime.toLocaleString("en-US", options)
      currentTimeString = currentTimeString.replaceAll("/", "-")
      currentTimeString = currentTimeString.replaceAll(",", "")
      currentTimeString = currentTime.getFullYear() + "-" + currentTimeString

      const result = await fetch(`/api/updateInventory?time=${encodeURIComponent(currentTimeString)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cart),
      });
  
      if (result.ok) {
        alert("Order Sent!");
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
    <>
      <title>TeaShare - Order Summary</title>
      <div className="flex flex-col items-center min-h-screen bg-gray-100">
        <header className="w-full bg-red-700 text-white py-6">
          <h1 className="text-4xl font-bold text-center">Order Summary</h1>
          {cart.length > 0 && (
            <p className="text-center mt-2 text-lg">Here is your order!</p>
          )}
          {cart.length === 0 && (
            <p className="text-center mt-2 text-lg">Click "Back to Selection" to create your order!</p>
          )}
        </header>

        {/* Total Price */}
        <div className="w-64 h-17 bg-gray-300 text-black text-3xl font-bold py-4 m-4 text-center rounded-lg items-center">
          <p>${cart.reduce((sum, item) => sum + item.quantity * parseFloat(item.price), 0).toFixed(2)}</p>
        </div>

        {/* Order List */}
        <div className="mt-4 w-9/10 p-6 min-h-3/4 bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="max-h-100 overflow-y-auto">
            {cart.map((item) => (
              <div key={item.itemid} className="flex justify-between items-center border-3 rounded-full px-4 py-3">
                {/* Item Details */}
                <div className="flex flex-col text-center w-1/2">
                  <span className="font-semibold text-gray-800">{item.name}</span>
                </div>

                <span className="w-20 text-lg font-bold text-center">${(item.quantity * parseFloat(item.price)).toFixed(2)}</span>

                {/* Quantity */}
                <span className="w-10 font-bold text-2xl text-center">x{item.quantity}</span>

                {/* Remove Button */}
                <button
                  onClick={() => removeFromCart(cart.findIndex(i => i.itemid === item.itemid))}
                  className="bg-red-700 text-white p-2 rounded-full hover:bg-red-900"
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
        <div className="flex flex-col md:flex-row justify-between w-full items-center mt-auto">
          <Link 
            href="/home" 
            className="flex bg-red-700 text-white text-3xl text-center items-center p-8 m-4 rounded-lg hover:bg-red-800">
              <p><b>Back to Selection</b></p>
          </Link>
          {cart.length > 0 && (
            <button 
              onClick={handleCheckout} 
              className="flex bg-green-700 text-white text-3xl text-center items-center p-8 m-4 rounded-lg hover:bg-green-800">
                <p><b>Complete Order</b></p>
            </button>
          )}
        </div>

        <footer className="w-full bg-red-700 text-white py-4 mt-5">
          <p className="text-center">© 2025 TeaShare. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}