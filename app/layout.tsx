"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {CartProvider} from '@/components/cartContext'
import {SessionProvider} from 'next-auth/react'
// TODO: FIx metadata issue


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* <Navbar /> */}
        <CartProvider>
          <SessionProvider>
            {children}
          </SessionProvider>
        </CartProvider>
      </body>
    </html>
  );
}
