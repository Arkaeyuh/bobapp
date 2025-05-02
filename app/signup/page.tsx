"use client";

import React, { useEffect } from 'react';
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart} from '@/components/cartContext'
import { translatePage } from "@/components/googleTranslateFunction";
import Link from "next/link";

export default function Signup() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const {language}  = useCart()

    async function handleSubmit(e: FormEvent) {
      e.preventDefault();
      setError("");
    
      // Check passwords match

      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      //Access the backend to sign up the user
    
      try {
        const response = await fetch("/api/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });
    
        const data = await response.json();
    
        if (!response.ok) {
          throw new Error(data.error || "Failed to sign up");
        }
    
        console.log("User signed up:", data);
        router.push("/");
      } catch (err: any) {
        setError(err.message || "Failed to sign up. Please try again later.");
      }
    }

    // Translate the page into the user's currently selected language on mount.
    useEffect(() => {
      translatePage(language)
    }, []);

  return (
    <>
      <title>TeaShare - Sign Up Page</title>
      <div className="flex items-center justify-center min-h-screen bg-gray-300">
        <div className="w-full max-w-md bg-white p-10 rounded-lg shadow-md">

          <h1 className="text-3xl font-bold text-center mb-6 text-black">Sign Up</h1>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <label htmlFor="email" className="text-xl text-gray-700">Email</label>
            <input
              type="email"
              placeholder="Email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black text-xl"
            />
              <label htmlFor="password" className="text-xl text-gray-700 m-0">Password</label>
              <input
              type="password"
              placeholder="Password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black text-xl"
              />
              <label htmlFor="confirmPassword" className="text-xl text-gray-700 m-0">Confirm Password</label>
              <input
              type="password"
              placeholder="Confirm Password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black text-xl"
              />
              <button
              type="submit"
              className="p-3 bg-blue-700 text-white text-xl rounded-lg hover:bg-blue-900 transition"
              >
              Sign Up
              </button>
          </form>


          {/* Back to Start */}
          <div className="mt-4">
            <Link href="/">
              <button className="p-3 bg-gray-100 text-black text-xl rounded-lg hover:bg-gray-200 transition w-full flex items-center justify-center gap-2">
                Back to Start
              </button>
            </Link>
          </div>

          {/* Link to login page */}
          <div className="flex justify-center text-center text-lg mt-4 text-black">
            <p className="mr-0.5"><b>Already have an account?</b></p>
            <Link href={{pathname:"/login"}} className="text-blue-700 hover:underline ml=0.5">
              <p><b>Login here</b></p>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}