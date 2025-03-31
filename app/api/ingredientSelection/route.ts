import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function GET(request: Request)
{
    const { searchParams } = new URL(request.url);
    const itemID = searchParams.get("itemID");
    try {
        const pool = getPool();
        // console.log(`SELECT ingredient.ingredientid, ingredient.name FROM ingredient JOIN ingredientitem ON ingredient.ingredientid=ingredientitem.ingredientid WHERE ingredientitem.itemid=${itemID}`)
        const defaultIngredients = await pool.query(
          `SELECT ingredient.ingredientid, ingredient.name FROM ingredient JOIN ingredientitem ON ingredient.ingredientid=ingredientitem.ingredientid WHERE ingredientitem.itemid=${itemID}`
        );

        const allIngredients = await pool.query(
          "SELECT ingredient.ingredientid, ingredient.name FROM ingredient"
        );

        const currentItem = await pool.query(
            `SELECT itemID, name, price, category FROM item WHERE itemID=${itemID}`
        );

        return NextResponse.json({ success: true, defaultIngredients: defaultIngredients.rows, ingredients: allIngredients.rows, currentItem:currentItem.rows});
      } catch (error) {
        console.error("Error getting ingredients from db:", error);
        return NextResponse.json({ success: false, error: "Failed to sign up user" }, { status: 500 });
      }
}

export async function POST()
{
    
}