"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <header className="w-full bg-blue-500 text-white py-6">
        <h1 className="text-4xl font-bold text-center">Welcome to ShareTea</h1>
        <p className="text-center mt-2 text-lg">Your favorite bubble tea destination!</p>
      </header>

      <main className="flex flex-col items-center mt-10 px-4">
        <h2 className="text-2xl font-semibold mb-4 text-black">Our Specialties</h2>
        <div className="text-center mb-8 text-gray-700">
          {/* This button will send you to the order summary */}
          <Link href="/orderSummary">
            <p className="text-blue-500 hover:underline">Go to Checkout</p>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

      <footer className="w-full bg-blue-500 text-white py-4 mt-10">
        <p className="text-center">© 2025 ShareTea. All rights reserved.</p>
      </footer>
    </div>
  );
}
