"use client";
import assert from 'assert';
import React, {createContext, useState, useContext, ReactNode} from 'react';
// To use the context, need the following three things
// 'use client'
// import { useCart, Item, Ingredient} from '@/components/cartContext'
// const {cart, addToCart, removeFromCart}  = useCart()
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
    cart: Item[]
    addToCart: (item:Item) => void;
    removeFromCart: (index:number) => void;
}

interface Props{
  children?: ReactNode
}

export const CartContext = createContext<cartContextType>({cart:[], addToCart: (item:Item)=>{}, removeFromCart: (index:number)=>{}});

export function CartProvider({children}:Props) {
  // setup for cart variable, addToCart method, and removeFromCart method
  const [cart, setCart] = useState<Item[]>([]);

  function addToCart(item:Item) {
    setCart(c => [...c, item]);
  }

  function removeFromCart(index:number) {
    assert(index >=0 && index < cart.length, "Invalid index passed to removeFromCart method in components/cartContext.tsx. Index got: "+ index+". Length: "+cart.length);
    setCart(c => c.slice(0, index).concat(c.slice(index+1)));
  }

  return (
    <CartContext.Provider value={{cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}