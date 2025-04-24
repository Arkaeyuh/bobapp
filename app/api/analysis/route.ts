import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function GET(request: Request) {
  // Grab the query want to execute from the params. For the analysis pages, instead of passing in a lot of parameters for the URL, 
  // it was easier to just construct the queries in the page.
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  try {
    const pool = getPool();
    // Execute the query and get the result. For the analysis chart , it will be the total ingredients used per day
    // and for x/z report it will be the total cash per hour over the range.
    const result = await pool.query(query || "")
    return NextResponse.json({ success: true, totalPerHours:result.rows});
  } catch (error) {
    console.error("Error getting ingredients from db:", error);
    return NextResponse.json({ success: false, error: "Failed to query databse for x/z report" }, { status: 500 });
  }
}

export async function POST(request: Request) {  
  // Grab the query want to execute from the params. For the analysis pages, instead of passing in a lot of parameters for the URL, 
  // it was easier to just construct the queries in the page.
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  try {
    const pool = getPool();
    // Execute the query. The only query here it to add a dummy entry to the transactions table that indicates when the z report was last run.
    await pool.query(query || "")
    return NextResponse.json({ success: true});
  } catch (error) {
    console.error("Error getting ingredients from db:", error);
    return NextResponse.json({ success: false, error: "Failed to query databse for x/z report" }, { status: 500 });
  }
}