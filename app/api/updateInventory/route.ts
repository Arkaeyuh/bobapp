// app/api/updateInventory/route.ts

import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import { getPool } from "@/lib/db";

export async function POST(request: Request) {
  try {
    // Parse the JSON request body
    const ingredients: { ingredientID: number; quantityUsed: number }[] = await request.json();

    let totalIngredientsUsed = 0;

    if (!Array.isArray(ingredients)) {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }

    // Connect to the database
    const pool = getPool();

    try {
      // Start a transaction
      await pool.query('BEGIN');

      // Loop through each ingredient in the array and update numInStock
      for (const { quantityUsed } of ingredients) {
        totalIngredientsUsed += quantityUsed;
      }

      const transactionQuery = await pool.query("SELECT COUNT(transactionID) FROM transaction");
      const transactionID = Number(transactionQuery.rows[0].count) + 1;
      console.log("Transaction ID: ", transactionID);
      console.log(transactionQuery.rows);

      // Getting current time
      const currentTime = new Date()
        const options: Intl.DateTimeFormatOptions = {
          hour12:false,
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit"
        }
        let currentTimeString = currentTime.toLocaleString("en-US", options)
        currentTimeString = currentTimeString.replaceAll("/","-")
        currentTimeString = currentTimeString.replaceAll(",","")
        currentTimeString = currentTime.getFullYear()+"-"+currentTimeString


      await pool.query(
        `INSERT INTO transaction VALUES ($1, $2, $3, $4, $5)`,
        [transactionID, 7, currentTimeString, 2, totalIngredientsUsed]
      );


      for (const { ingredientID, quantityUsed } of ingredients) {
        await pool.query(
          `UPDATE ingredient 
           SET numInStock = numInStock - $1 
           WHERE ingredientID = $2`,
          [quantityUsed, ingredientID]
        );
      }

      // Commit the transaction if all updates succeed
      await pool.query('COMMIT');
      return NextResponse.json({ message: 'Ingredients updated successfully' });
    } catch (error) {
      // Roll back the transaction if an error occurs
      await pool.query('ROLLBACK');
      console.error("Error updating ingredients:", error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  } catch (error) {
    console.error("Error parsing request body:", error);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
