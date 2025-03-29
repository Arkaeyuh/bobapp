import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function GET() {
  try {
    const pool = await getPool();
    const result = await pool.query("SELECT * FROM employee");

    return NextResponse.json({ success: true, employees: result.rows });
  } catch (error) {
    console.error("Error fetching employees:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch employees" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const pool = await getPool();
    const body = await req.json();

    const { employeeid, lastname, firstname, ismanager } = body;

    await pool.query(
      "INSERT INTO employee (employeeid, lastname, firstname, ismanager) VALUES ($1, $2, $3, $4)",
      [employeeid, lastname, firstname, ismanager]
    );

    return NextResponse.json({
      success: true,
      message: "Employee added successfully",
    });
  } catch (error) {
    console.error("Error adding employee:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add employee" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const pool = await getPool();
    const { searchParams } = new URL(req.url);
    const employeeid = searchParams.get("employeeid");

    if (!employeeid)
      return NextResponse.json(
        { success: false, error: "Employee ID is required" },
        { status: 400 }
      );

    await pool.query("DELETE FROM employee WHERE employeeid = $1", [
      employeeid,
    ]);

    return NextResponse.json({
      success: true,
      message: "Employee removed successfully",
    });
  } catch (error) {
    console.error("Error removing employee:", error);
    return NextResponse.json(
      { success: false, error: "Failed to remove employee" },
      { status: 500 }
    );
  }
}
