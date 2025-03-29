import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

// psql -h csce-315-db.engr.tamu.edu -U team_43 -d team_43_db

export async function GET() {
  try {
    const pool = await getPool();
    const result = await pool.query("SELECT * FROM item");

    return NextResponse.json({ success: true, items: result.rows });
  } catch (error) {
    console.error("Error fetching items:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch items" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const pool = await getPool();
    const body = await req.json();

    const { itemid, name, ingredientid, price, category } = body;

    await pool.query(
      "INSERT INTO item (itemid, name, ingredientid, price, category) VALUES ($1, $2, $3, $4, $5)",
      [itemid, name, ingredientid, price, category]
    );

    return NextResponse.json({
      success: true,
      message: "Item added successfully",
    });
  } catch (error) {
    console.error("Error adding item:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add item" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const pool = await getPool();
    const body = await req.json();

    const { itemid } = body;

    await pool.query("DELETE FROM item WHERE itemid = $1", [itemid]);

    return NextResponse.json({
      success: true,
      message: "Item removed successfully",
    });
  } catch (error) {
    console.error("Error removing item:", error);
    return NextResponse.json(
      { success: false, error: "Failed to remove item" },
      { status: 500 }
    );
  }
}
