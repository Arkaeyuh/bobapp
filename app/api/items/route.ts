// app/api/items/route.ts
import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  if (!category) {
    return NextResponse.json({ error: "Category is required" }, { status: 400 });
  }

  const pool = getPool();

  try {
    const result = await pool.query(
      'SELECT * FROM item WHERE category = $1',
      [category]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Database error:", error); 
    return NextResponse.json({ error: "Database query failed" }, { status: 500 });
  }
}
