import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

// psql -h csce-315-db.engr.tamu.edu -U team_43 -d team_43_db

export async function GET() {
  try {
    const pool = await getPool();
    const result = await pool.query("SELECT * FROM ingredient");

    return NextResponse.json({ success: true, ingredients: result.rows });
  } catch (error) {
    console.error("Error fetching ingredients:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch ingredients" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const pool = await getPool();
    const body = await req.json();

    const { ingredientid, name, numinstock, maxnum } = body;

    await pool.query(
      "INSERT INTO ingredient (ingredientid, name, numinstock, maxnum) VALUES ($1, $2, $3, $4)",
      [ingredientid, name, numinstock, maxnum]
    );

    return NextResponse.json({
      success: true,
      message: "Ingredient added successfully",
    });
  } catch (error) {
    console.error("Error adding ingredient:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add ingredient" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const pool = await getPool();
    const body = await req.json();

    const { ingredientid } = body;

    await pool.query("DELETE FROM ingredient WHERE ingredientid = $1", [
      ingredientid,
    ]);

    return NextResponse.json({
      success: true,
      message: "Ingredient removed successfully",
    });
  } catch (error) {
    console.error("Error removing ingredient:", error);
    return NextResponse.json(
      { success: false, error: "Failed to remove ingredient" },
      { status: 500 }
    );
  }
}
