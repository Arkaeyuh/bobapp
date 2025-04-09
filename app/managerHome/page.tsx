"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function managerHome() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {/* Header Selection */}
      <header className="w-full bg-blue-500 text-white py-6 mb-4">
        <h1 className="text-4xl font-bold text-center">Manager Home</h1>
        <p className="text-center mt-2 text-lg">Manage your store efficiently!</p>
      </header>

      {/* Selection Section */}
      <div className="flex flex-row w-full items-center justify-center mb-10">
        <div className="flex flex-col w-1/4 bg-white rounded-lg shadow-md p-6">
          <Link href="/manageEmp">
            <div className="cursor-pointer bg-white p-6 rounded-lg shadow-md text-center transform transition-transform duration-300 hover:scale-105">
              <h3 className="text-xl font-bold mb-2 text-black">Manage Employees</h3>
              <p className="text-gray-700">Add, remove, or update employee details.</p>
            </div>
          </Link>
          <Link href="/manageIngre">
            <div className="cursor-pointer bg-white p-6 rounded-lg shadow-md text-center transform transition-transform duration-300 hover:scale-105 mt-4">
              <h3 className="text-xl font-bold mb-2 text-black">Manage Ingredients</h3>
              <p className="text-gray-700">Add, remove, or update ingredient details.</p>
            </div>
          </Link>
        </div>
        <div className="w-1/4 bg-white rounded-lg shadow-md p-6 mx-4">
          <Link href="/manageItem">
            <div className="cursor-pointer bg-white p-6 rounded-lg shadow-md text-center transform transition-transform duration-300 hover:scale-105">
              <h3 className="text-xl font-bold mb-2 text-black">Manage Items</h3>
              <p className="text-gray-700">Add, remove, or update menu items.</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}