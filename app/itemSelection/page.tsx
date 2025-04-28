"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useCart } from "@/components/cartContext";
import { translatePage } from "@/components/googleTranslateFunction";

type Item = {
  itemid: number;
  name: string;
  price: number;
  category: string;
};

function ItemSelectionContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  // State to hold items, loading state, and error message

  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const {language}  = useCart()

  // Translate the page into the user's currently selected language after done loading.
  useEffect(()=>{
    if(!loading)
      translatePage(language)
  },[loading])

  useEffect(() => {
    if (!category) return;

    async function fetchItems() {
      try {
        const res = await fetch(
          // Fetching items from the backend
          // The backend will return all items in the category specified by the URL parameter
          `/api/items?category=${encodeURIComponent(category || "")}`
        );
        const data = await res.json();

        if (res.ok) {
          setItems(data);

          // Checking for dynamic menu pricing
          const itemPriceChange = getItemPriceChange()
          // Changing all item's price if there is a dynamic menu change
          if(itemPriceChange!=0)
          {
            setItems((old)=>{
              let answer:Item[] = []
              const minPrice:number = 0.50
              
              for(let i=0; i<old.length; i++)
              {
                const oldPrice = old[i].price
                // If ever want a percent increase/decrease instead of just +/- a constant, can change to multiply in below statement.
                const temp:Item = {...old[i], price:(Math.max(Number(oldPrice)+itemPriceChange,minPrice))}
                answer.push(temp)
              }
              return answer
            })
          }
          
        } else {
          setError(data.error || "Something went wrong");
        }
      } catch (err) {
        setError("Failed to fetch items");
      } finally {
        setLoading(false);
      }
    }

    fetchItems();
  }, [category]);

  function getItemPriceChange() {
    let totalChange = 0
    const currentTime = new Date()
    // Happy Hour (5pm-9pm), -1
    if(currentTime.getHours() >= 17 && currentTime.getHours()<=21)
      totalChange-=1;
    // Not that busy right after open 10am-12pm, -1
    if(currentTime.getHours() >= 10 && currentTime.getHours()<=12)
      totalChange-=1;
    // Late customers are desperate 12am-4am, +1
    if(currentTime.getHours() >=0  && currentTime.getHours()<=4)
      totalChange+=1;
    // Fri/Sat/Sun are busy, +1
    if(currentTime.getDay() >= 5 || currentTime.getDay()==0)
      totalChange+=1;
    return totalChange
  }

  return (
    <>
      <title>TeaShare - Select Item</title>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        {/* Header */}
        <header className="w-full bg-red-700 text-white py-6 mb-4 flex flex-col md:flex-row md:justify-between gap-y-4 px-6">
          {/* Left column */}
          <div className="flex justify-start">
            <Link 
              href="/home"
              className="flex items-center bg-gray-200 text-2xl text-black hover:bg-gray-300 transition py-3 px-6 rounded-lg shadow-md"
            >
              <span>Change Category</span>
            </Link>
          </div>

          {/* Center column */}
          <div className="text-center">
            <h1 className="text-4xl font-bold">Item Selection</h1>
            <p className="mt-2 text-lg">
              {category
                ? `Browse our delicious ${category} options`
                : "No category selected"}
            </p>
          </div>

          {/* Right column */}
          <div className="flex justify-end">
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center bg-red-200 text-2xl text-black hover:bg-red-100 transition py-3 px-6 rounded-lg shadow-md"
            >
              Sign Out
            </button>
          </div>
        </header>

        <main className="flex flex-col items-center mt-10 px-4 w-full">
          <h2 className="text-4xl font-semibold mb-6 text-black">
            {category} Menu
          </h2>

          {loading && <p className="text-gray-700">Loading items...</p>}
          {error && <p className="text-red-500">{error}</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl">
            {items.map((item) => (
              <div
                key={item.itemid}
                className="bg-white p-6 rounded-lg shadow-md text-center transform transition-transform duration-300 hover:scale-105"
              >
                <h3 className="text-2xl font-bold text-black mb-2">{item.name}</h3>
                <p className="text-gray-700 text-xl font-bold mb-4">${Number(item.price).toFixed(2)}</p>
                <Link
                  href={{
                    pathname: "/ingredientSelection",
                    query: { itemid: item.itemid, itemprice: item.price},
                  }}
                  className="m-4 px-4 py-2 bg-red-700 text-white text-lg rounded hover:bg-red-900"
                >
                  <span>Select Item</span>
                </Link>
              </div>
            ))}
          </div>
        </main>

        <footer className="w-full bg-red-700 text-white py-4 mt-10">
          <p className="text-center">© 2025 TeaShare. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}

export default function ItemSelectionPage() {
  return (
    <Suspense fallback={<p className="text-center mt-10">Loading...</p>}>
      <ItemSelectionContent />
    </Suspense>
  );
}