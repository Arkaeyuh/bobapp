// app/api/updateInventory/route.ts

import { NextResponse } from 'next/server';
import { getPool } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { Item } from "@/components/cartContext";

export async function POST(request: Request) {
  try {
    // The cart gets sent over the POST request
    const cart: Item[] = await request.json();

    // What we need to do is gather the cart and turn it into usable data.
    const ingredientUsage: Record<number, number> = {}; // { ingredientID: totalUsed }

    let orderCost: number = 0;
    let totalIngredientsUsed = 0;

    // Go through cart and get total cost, along with ingredient count information
    cart.forEach(item => {
      item.ingredients.forEach(ingredient => {
        const usedInCurrItem = item.quantity; // 1 per item by default, adjust if needed
        if (ingredientUsage[ingredient.ingredientid]) {
          ingredientUsage[ingredient.ingredientid] += usedInCurrItem;
        } else {
          ingredientUsage[ingredient.ingredientid] = usedInCurrItem;
        }
        totalIngredientsUsed += usedInCurrItem; // Accumulate total ingredients used
      });
      // Calculate the total cost of all items
      orderCost += parseFloat(item.price) * item.quantity;
    });
  
    // Convert to array format for the backend
    const ingredients = Object.entries(ingredientUsage).map(
      ([ingredientID, quantityUsed]) => ({
        ingredientID: Number(ingredientID),
        quantityUsed,
      })
    );

    // Current session so we can get data about the user
    const session = await getServerSession(authOptions);

    if (!Array.isArray(ingredients)) {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }

    // Connect to the database
    const pool = getPool();

    try {
      // Start a transaction
      // Use BEGIN so that if anything fails, we can roll back all the successful updates
      await pool.query('BEGIN');

      /* 
       * In order to update the transaction database, we need the:
       * 1) transaction ID
       * 2) total order cost
       * 3) time
       * 4) employee ID
       * 5) total ingredients used
      */

      // 1) Gather the transaction ID
      const transactionQuery = await pool.query("SELECT COUNT(transactionID) FROM transaction");
      const transactionID = Number(transactionQuery.rows[0].count) + 1;
      console.log("Transaction ID: ", transactionID);
      console.log(transactionQuery.rows);

      // 3) Get the time
      const { searchParams } = new URL(request.url);
      const currentTimeString = searchParams.get("time");

      // 4) Get the Employee ID
      // Get the user role from the session, and use that to get the employeeID from the employee table.
      // Lets use employee id 0 for transactions associated with customers, and the regular employee id for those with employees
      let employeeID: Number;

      if (session?.user.role === "employee"){
        employeeID = session?.user.employeeid;
      } else{
        employeeID = 0;
      }

      // Debugging: Log variables passed into the transaction query
      console.log("Transaction ID:", transactionID);
      console.log("Total Amount:", 7); // Fixed price for now
      console.log("Transaction Time:", currentTimeString);
      console.log("Employee ID:", employeeID);
      console.log("Total Ingredients Used:", totalIngredientsUsed);

      // Insert the transaction to the database
      await pool.query(
        `INSERT INTO transaction (transactionID, totalAmount, transactionTime, employeeID, numIngredientsUsed) VALUES ($1, $2, $3, $4, $5)`,
        [transactionID, orderCost, currentTimeString, employeeID, totalIngredientsUsed]
      );

      // Update the stock
      for (const { ingredientID, quantityUsed } of ingredients) {
        await pool.query(
          `UPDATE ingredient 
           SET numInStock = numInStock - $1 
           WHERE ingredientID = $2`,
          [quantityUsed, ingredientID]
        );
      }

      // Update transactionItem table
      for (const item of cart) {
        await pool.query(
          `INSERT INTO transactionitem (transactionID, itemID, quantity)
           VALUES ($1, $2, $3)`,
          [transactionID, item.itemid, item.quantity]
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
