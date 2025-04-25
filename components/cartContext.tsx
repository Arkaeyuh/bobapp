"use client";
import assert from 'assert';
import React, {createContext, useState, useContext, ReactNode} from 'react';
// To use the context for its cart, need the following three things
// 'use client'
// import { useCart, Item, Ingredient} from '@/components/cartContext'
// const {cart, addToCart, removeFromCart, clearCart}  = useCart()
// Top 2 should be at beginning of file. Last one should be inside the export default function

// Type Definitions for Item, Ingredient, and the cartContextType
export interface Item {
    itemid: number
    name: string
    quantity: number
    price: string;
    category: string;
    ingredients: Ingredient[]
}

export interface Ingredient {
    ingredientid: number
    name: string
}

interface cartContextType {
  // Stuff for the cart
  cart: Item[]
  addToCart: (item:Item) => void
  removeFromCart: (index:number) => void
  clearCart: () => void
  // Stuff for language selection
  language:string
  changeLanguage:(newLanguage:string)=>void
}

interface Props{
  children?: ReactNode
}

// Default values are just empty arrays/strings and methods that don't do anything
export const CartContext = createContext<cartContextType>({
  cart:[], 
  addToCart: (item:Item)=>{}, 
  removeFromCart: (index:number)=>{},
  clearCart: () => {},
  language:"",
  changeLanguage:(newLanguage:string)=>{},
});

export function CartProvider({children}:Props) {
  // setup for cart variable, addToCart method, removeFromCart, and clearCart method
  const [cart, setCart] = useState<Item[]>([]);

  function addToCart(item:Item) {
    setCart(c => [...c, item]);
  }

  function removeFromCart(index:number) {
    assert(index >= 0 && index < cart.length, "Invalid index passed to removeFromCart method in components/cartContext.tsx. Index got: "+ index+". Length: "+cart.length);
    setCart(c => c.slice(0, index).concat(c.slice(index+1)));
  }

  function clearCart() {
    setCart([]);
  }

  // Setup for the language variable and changeLanguage method
  // It uses session storage because the context doesn't fully work everywhere. Also it makes testing easier.
  let currentLanguage = null
  if(typeof window !== 'undefined') // If window is undefined, means are server-side, so sessionStorage wouldn't work
    currentLanguage = sessionStorage.getItem("lang")

  const [language, setLanguage] = useState<string>(currentLanguage || "en")

  if(typeof window !== 'undefined')
    sessionStorage.setItem("lang",language)

  function changeLanguage(newLanguage:string) {
    setLanguage((oldLanguage)=>newLanguage)
    sessionStorage.setItem("lang", newLanguage);
  }

  return (
    <CartContext.Provider value={{cart, addToCart, removeFromCart, clearCart, language, changeLanguage}}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}