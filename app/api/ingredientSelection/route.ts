import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function GET()
{
    try {
        const pool = getPool();

        const defaultIngredients = await pool.query(
          "SELECT ingredient.ingredientid, ingredient.name FROM ingredient JOIN ingredientitem ON ingredient.ingredientid=ingredientitem.ingredientid WHERE ingredientitem.itemid=1"
        );
        
        const allIngredients = await pool.query(
          "SELECT ingredient.ingredientid, ingredient.name FROM ingredient"
        );
        
        return NextResponse.json({ success: true, defaultIngredients: defaultIngredients.rows, ingredients: allIngredients.rows});
      } catch (error) {
        console.error("Error getting ingredients from db:", error);
        return NextResponse.json({ success: false, error: "Failed to sign up user" }, { status: 500 });
      }
}

export async function POST()
{
    
}