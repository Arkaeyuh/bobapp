"use client";

import { FormEvent, useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import { FcGoogle } from "react-icons/fc"; // Import the Google logo icon
import { useCart} from '@/components/cartContext'
import { translatePage } from "@/components/googleTranslateFunction";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const { data: session, status } = useSession(); // Use status to check session state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const {language}  = useCart()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError("Invalid email or password");
    }
  }

  // Redirect based on session once it's authenticated
  useEffect(() => {
    if (status === "authenticated") {
      if (session?.user?.ismanager && session?.user?.role === "employee") {
        router.push("/managerHome"); // Manager-specific home page
      } else {
        router.push("/home"); // Regular user home page
      }
    }
  }, [session, status, router]);

  // Translate the page into the user's currently selected language when loading and after loading.
  // The false indicates to not translate the contents of buttons. Because the "sign in with Google" button has an image, 
  // translating it leads to bad results.
  useEffect(() => {
    translatePage(language, undefined, undefined, false)
  }, [status]);

  // Show a loading state while the session is being checked
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-700">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <title>TeaShare - Login Page</title>
      <div className="flex items-center justify-center min-h-screen bg-gray-300">
        <div className="flex flex-col w-full max-w-md bg-white p-10 rounded-lg shadow-md">

          <h1 className="text-4xl font-bold text-center mb-6 text-black">TeaShare</h1>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <label htmlFor="email" className="text-lg text-gray-700">Email</label>
            <input
              type="email"
              placeholder="Email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black text-xl"
            />

            <label htmlFor="password" className="text-lg text-gray-700 m-0">Password</label>
            <input
              type="password"
              placeholder="Password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black text-xl"
            />
              <button
              type="submit"
              className="p-3 bg-blue-600 text-white text-xl rounded-lg hover:bg-blue-800 transition"
              >
              <p><b>Login</b></p>
              </button>
          </form>

          {/* Google Sign-In Button */}
          <div className="mt-4">
            <button
              type="button"
              onClick={() => signIn("google")}
              className="p-3 bg-gray-100 text-black text-xl rounded-lg hover:bg-gray-200 transition w-full flex items-center justify-center gap-2"
            >
              <FcGoogle size={24} /> {/* Google logo */}
              <p><b>Sign in with Google</b></p>
            </button>
          </div>
          {/* Signup Link */}
          <div className="flex justify-center text-center text-lg mt-4 text-black">
            <p className="mr-0.5"><b>New user?</b></p>
            <Link href={{pathname:"/signup"}} className="text-blue-700 hover:underline ml-0.5">
              <p><b>Register here</b></p>
            </Link>
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      </div>
    </>
  );
}