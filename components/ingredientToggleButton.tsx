'use client'
import React, {createContext, useState, useContext, ReactNode} from 'react';
import { useCart, Item, Ingredient} from '@/components/cartContext'

interface IngredientToggleButtonProps {
    uniqueID:number,
    ingredient: Ingredient,
    selected: boolean
}

export function IngredientToggleButton({uniqueID, ingredient, selected}: IngredientToggleButtonProps) {
    // const [ingredi, setIngredient] = useState<Ingredient>(ingredient);
    const [select, setSelect] = useState<boolean>(selected);

    function toggle() {
        if(select) {
            setSelect(false)
            const element = document.getElementById("ingredButton"+uniqueID)
            if(element)
                element.className = "text-blue-400"
        }
        else {
            setSelect(true)
            const element = document.getElementById("ingredButton"+uniqueID)
            if(element)
                element.className = "text-red-400"
        }
    }

    function getResult(): Ingredient|undefined {
        if(select)
            return ingredient
        else
            return undefined
    }

    if(select)
    {
        return (
            <button id={"ingredButton"+uniqueID} className="text-red-400" onClick={()=>toggle()}>{ingredient.name}</button>
          )
    }   
    else
    {
        return (
            <button id={"ingredButton"+uniqueID} className="text-blue-400" onClick={()=>toggle()}>{ingredient.name}</button>
          )
    }
 
}