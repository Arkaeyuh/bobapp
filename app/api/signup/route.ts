import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import pool from "@/lib/db"; // Import the database connection

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();


    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the user into the database
    const result = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id",
      [email, hashedPassword]
    );

    return NextResponse.json({ success: true, userId: result.rows[0].id });
  } catch (error) {
    console.error("Error inserting user:", error);
    return NextResponse.json({ success: false, error: "Failed to sign up user" }, { status: 500 });
  }
}