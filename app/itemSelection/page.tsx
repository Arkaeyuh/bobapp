"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

type Item = {
  itemid: number;
  name: string;
  price: number;
  category: string;
};

function ItemSelectionContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!category) return;

    async function fetchItems() {
      try {
        const res = await fetch(`/api/items?category=${encodeURIComponent(category || "")}`);
        const data = await res.json();

        if (res.ok) {
          setItems(data);
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <header className="w-full bg-blue-500 text-white py-6">
        <h1 className="text-4xl font-bold text-center">Item Selection</h1>
        <p className="text-center mt-2 text-lg">
          {category ? `Browse our delicious ${category} options` : "No category selected"}
        </p>
      </header>

      <main className="flex flex-col items-center mt-10 px-4 w-full">
        <h2 className="text-2xl font-semibold mb-6 text-black">{category} Menu</h2>

        {loading && <p className="text-gray-700">Loading items...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl">
          {items.map((item) => (
            <div
              key={item.itemid}
              className="bg-white p-6 rounded-lg shadow-md text-center transform transition-transform duration-300 hover:scale-105"
            >
              <h3 className="text-xl font-bold text-black mb-2">{item.name}</h3>
              <p className="text-gray-700">${Number(item.price).toFixed(2)}</p>
              <Link href={{ pathname: "/ingredientSelection", query: { itemid: item.itemid } }}>
                <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  Add to Cart
                </button>
              </Link>
            </div>
          ))}
        </div>
      </main>

      <footer className="w-full bg-blue-500 text-white py-4 mt-10">
        <p className="text-center">© 2025 ShareTea. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default function ItemSelectionPage() {
  return (
    <Suspense fallback={<p className="text-center mt-10">Loading...</p>}>
      <ItemSelectionContent />
    </Suspense>
  );
}