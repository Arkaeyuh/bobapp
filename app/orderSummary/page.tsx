"use client";

import React from "react";
import Link from "next/link";
import { useCart, Item, Ingredient} from '@/components/cartContext'
import { useRouter } from 'next/navigation';

export default function OrderSummary() {
  const {cart, removeFromCart, clearCart}  = useCart()
  const router = useRouter();

  // Structure of an item in the cart
  // { id: number; name: string; price: number; quantity: number; ingredients: Ingredient[]; }
  
  const handleCheckout = async () => {
    // Aggregate total quantity of each ingredient used
    const ingredientUsage: Record<number, number> = {}; // { ingredientID: totalUsed }
  
    cart.forEach(item => {
      item.ingredients.forEach(ingredient => {
        const usedInCurrItem = item.quantity; // 1 per item by default, adjust if needed
        if (ingredientUsage[ingredient.ingredientid]) {
          ingredientUsage[ingredient.ingredientid] += usedInCurrItem;
        } else {
          ingredientUsage[ingredient.ingredientid] = usedInCurrItem;
        }
      });
    });
  
    // Convert to array format for the backend
    const ingredientsToUpdate = Object.entries(ingredientUsage).map(
      ([ingredientID, quantityUsed]) => ({
        ingredientID: Number(ingredientID),
        quantityUsed,
      })
    );

    // ingredientsToUpdate.unshift({ ingredientID: 999, quantityUsed: 999 }); // Add dummy entry for ingredientID 1
  
    // Send to backend
    try {
      const result = await fetch("/api/updateInventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ingredientsToUpdate),
      });
  
      if (result.ok) {
        alert("Ingredients updated!");
        // optionally clear cart or redirect
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
                <span className="text-gray-500 text-sm">Description...</span>
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

        {/* Scroll Indicator (only shows if there are > 3 items) */}
        {cart.length > 5 && (
          <div className="bg-gray-700 text-white text-center py-2 text-sm">
            Scroll to see more ▼
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-between w-full h-50 mt-4 items-center mt-auto">
        <Link 
          href="/home" 
          className="flex bg-red-700 text-white text-3xl text-center items-center w-1/6 h-1/2 py-2 px-4 rounded-lg hover:bg-red-800">
            Back to Selection
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