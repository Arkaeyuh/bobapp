import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

// psql -h csce-315-db.engr.tamu.edu -U team_43 -d team_43_db

export async function GET() {
  try {
    const pool = await getPool();
    const result = await pool.query("SELECT * FROM seasonal");

    return NextResponse.json({ success: true, items: result.rows });
  } catch (error) {
    console.error("Error fetching seasonal:", error);
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

    const { seasonalid, name, ingredientid, price, category } = body;

    await pool.query(
      "INSERT INTO seasonal (seasonalid, name, ingredientid, price, category) VALUES ($1, $2, $3, $4, $5)",
      [seasonalid, name, ingredientid, price, category]
    );

    return NextResponse.json({
      success: true,
      message: "Seasonal added successfully",
    });
  } catch (error) {
    console.error("Error adding seasonal:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add seasonal" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const pool = await getPool();
    const body = await req.json();

    const { seasonalid } = body;

    await pool.query("DELETE FROM seasonal WHERE seasonalid = $1", [
      seasonalid,
    ]);

    return NextResponse.json({
      success: true,
      message: "Seasonal removed successfully",
    });
  } catch (error) {
    console.error("Error removing seasonal:", error);
    return NextResponse.json(
      { success: false, error: "Failed to remove seasonal" },
      { status: 500 }
    );
  }
}
