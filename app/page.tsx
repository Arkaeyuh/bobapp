"use client";

import Link from "next/link";
import React from "react";

export default function KioskLandingPage() {

  const handlePageClick = () => {
    // Direct the guest user to the main/home page.
    window.location.href = "/home";
  };

  return (
    <div
      onClick={handlePageClick}
      className="relative flex flex-col items-center justify-center min-h-screen bg-gray-100 cursor-pointer"
    >
      {/* Register Link */}
      <div className="absolute top-12 left-8" onClick={(e) => e.stopPropagation()}>
        <Link href="/signup">
          <span className="px-16 py-8 bg-blue-500 text-white text-2xl font-bold rounded-xl hover:bg-blue-600 shadow-xl">
            Register
          </span>
        </Link>
      </div>

      {/* Login Link */}
      <div className="absolute top-12 right-8" onClick={(e) => e.stopPropagation()}>
        <Link href="/login">
          <span className="px-16 py-8 bg-blue-500 text-white text-2xl font-bold rounded-xl hover:bg-blue-600 shadow-xl">
            Login
          </span>
        </Link>
      </div>

      {/* Main Content */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-black">
          Welcome to ShareTea
        </h1>
        <p className="text-lg text-black">Click anywhere to get started</p>
      </div>
    </div>
  );
}