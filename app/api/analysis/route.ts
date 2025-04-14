import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function GET(request: Request)
{
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");
    // console.log(query)
    try {
        const pool = getPool();
        const totalPerHourResult = await pool.query(query || "")
        return NextResponse.json({ success: true, totalPerHours:totalPerHourResult.rows});
      } catch (error) {
        console.error("Error getting ingredients from db:", error);
        return NextResponse.json({ success: false, error: "Failed to query databse for x/z report" }, { status: 500 });
      }
}