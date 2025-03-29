'use client'
import React, {useEffect, useState} from 'react'
import { useCart, Item, Ingredient} from '@/components/cartContext'
import {IngredientToggleButton} from '@/components/ingredientToggleButton'

export default function ingredientSelection(currentItem: Item)
{
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [defaultIngredientIds, setDefaultIngredientIds] = useState<Set<number>>(new Set());

    useEffect(() => {
        fetchIngredients();
      }, []); //TODO -> might need to change to run more than on mount? 
    
    async function fetchIngredients() {
      try {
        // Getting ingredients
        const response = await fetch("/api/ingredientSelection", {method: 'Get'});
        if (!response.ok) 
            throw new Error("Failed to fetch ingredients");
        const data = await response.json();

        // Adding default ingredient IDs to a set
        for (let i=0; i<data.defaultIngredients.length; i++)
        {
          setDefaultIngredientIds(s => s.add(data.defaultIngredients[i].ingredientid))
        }
        
        // Setting ingredients to be all ingredients available in the store
        setIngredients((i)=>data.ingredients);
        // Setting ingredients to not contain default ingredients
        setIngredients((i)=>i.filter((ingred) => !defaultIngredientIds.has(ingred.ingredientid)))
        // Adding the default ingredients back to the beginning of ingredients
        setIngredients((i) => data.defaultIngredients.concat(...i))
      } catch (error) {
        console.error("Error fetching ingredients:", error);
      }
    }

    return(
        <>
            <h2> HELLO</h2>
            {
                //Adding all of the ingredient buttons
                ingredients.map((ingred, index) => (
                        <IngredientToggleButton key={index} uniqueID={index} ingredient={ingred} selected={defaultIngredientIds.has(ingred.ingredientid)}></IngredientToggleButton>
                    )
                )
            }
            <button onClick={()=> console.log(ingredients)}>||Display Ingredients Array In Console||</button>
        </>
    )
}