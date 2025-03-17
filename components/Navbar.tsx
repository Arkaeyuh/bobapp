"use client";

import Link from "next/link";
import React from "react";

export default function Navbar() {
  return (
    <nav className="w-full bg-transparent p-4 shadow-md flex items-center justify-around fixed top-0 left-0 right-0 z-50">
      {/* Navigation links */}
      <ul className="flex space-x-8">
        <li>
          <Link href="/" className="text-white hover:text-purple-700 text-lg transition duration-300 ease-in-out focus:outline-none focus:ring-0">
            Home
          </Link>
        </li>
        <li>
          <Link href="/login" className="text-white hover:text-purple-700 text-lg transition duration-300 ease-in-out focus:outline-none focus:ring-0">
            Login
          </Link>
        </li>
        <li>
          <Link href="/signup" className="text-white hover:text-purple-700 text-lg transition duration-300 ease-in-out focus:outline-none focus:ring-0">
            Signup
          </Link>
        </li>
      </ul>
    </nav>
  );
}