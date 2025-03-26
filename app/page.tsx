"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

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
    } else {
      router.push("/home");
    }
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-10 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-black">TeaShare</h1>
        <form className="flex flex-col gap-4"
        onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
          <input
            type="password"
            placeholder="Password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
          <button
            type="submit"
            className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Login
          </button>
        </form>
        <p className="text-center mt-4 text-black">
          New user?{' '}
          <a href="/signup" className="text-blue-500 hover:underline">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}