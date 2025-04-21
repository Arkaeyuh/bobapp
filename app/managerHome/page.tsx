"use client";

import React from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";

export default function managerHome() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {/* Header */}
      <header className="w-full bg-blue-500 text-white py-6 mb-4 grid grid-cols-3 items-center px-6">
        {/* Left column */}
        <div className="flex justify-start">
          <Link href="/">
            <button className="bg-blue-100 text-black hover:bg-blue-200 transition py-3 px-6 rounded-lg shadow-md text-lg">
              Back
            </button>
          </Link>
        </div>

        {/* Center column */}
        <div className="text-center">
          <h1 className="text-4xl font-bold">Manager Home</h1>
          <p className="mt-2 text-lg">Manage your store efficiently!</p>
        </div>

        {/* Right column */}
        <div className="flex justify-end">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="bg-red-500 hover:bg-red-600 transition py-3 px-6 rounded-lg shadow-md text-lg"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Selection Section */}
      <div className="flex flex-row w-full items-center justify-center mb-10">
        <div className="flex flex-col w-1/4 bg-white rounded-lg shadow-md p-6">
          <Link href="/manageEmp">
            <div
              className="flex flex-col justify-center cursor-pointer h-40 bg-white p-6 rounded-lg 
                              shadow-md text-center transform transition-transform duration-300 hover:scale-105"
            >
              <h3 className="text-xl font-bold mb-2 text-black">
                Manage Employees
              </h3>
              <p className="text-gray-700">
                Add, remove, or update employee details.
              </p>
            </div>
          </Link>
          <Link href="/manageIngre">
            <div
              className="flex flex-col justify-center cursor-pointer h-40 bg-white p-6 rounded-lg 
                              shadow-md text-center transform transition-transform duration-300 hover:scale-105 mt-4"
            >
              <h3 className="text-xl font-bold mb-2 text-black">
                Manage Ingredients
              </h3>
              <p className="text-gray-700">
                Add, remove, or update ingredient details.
              </p>
            </div>
          </Link>
        </div>
        <div className="w-1/4 bg-white rounded-lg shadow-md p-6 mx-4">
          <Link href="/manageItem">
            <div
              className="flex flex-col justify-center cursor-pointer h-40 bg-white p-6 rounded-lg 
                              shadow-md text-center transform transition-transform duration-300 hover:scale-105"
            >
              <h3 className="text-xl font-bold mb-2 text-black">
                Manage Items
              </h3>
              <p className="text-gray-700">
                Add, remove, or update menu items.
              </p>
            </div>
          </Link>
          <Link href="/weather">
            <div
              className="flex flex-col justify-center cursor-pointer h-40 bg-white p-6 rounded-lg 
                              shadow-md text-center transform transition-transform duration-300 hover:scale-105 mt-4"
            >
              <h3 className="text-xl font-bold mb-2 text-black">
                View Weather
              </h3>
              <p className="text-gray-700">
                Check the current weather conditions.
              </p>
            </div>
          </Link>
        </div>
        <div className="w-1/4 bg-white rounded-lg shadow-md p-6 mr-4">
          <Link href="/analysis">
            <div
              className="flex flex-col justify-center cursor-pointer h-40 bg-white p-6 rounded-lg 
                              shadow-md text-center transform transition-transform duration-300 hover:scale-105"
            >
              <h3 className="text-xl font-bold mb-2 text-black">
                Analysis and Reports
              </h3>
              <p className="text-gray-700">
                Analyze ingredient usage and create reports.
              </p>
            </div>
          </Link>
        </div>
      </div>
      <Link href="/home">
        <div className="text-center text-4xl text-white font-bold bg-green-500 hover:bg-green-600 transition py-3 px-6 rounded-lg shadow-md">
          Go to Cashier View
        </div>
      </Link>
    </div>
  );
}
