'use client'
import React, {createContext, useState, useContext, ReactNode} from 'react';
import { useCart, Item, Ingredient} from '@/components/cartContext'

interface IngredientToggleButtonProps {
    uniqueID:number,
    ingredient: Ingredient,
    selected: boolean
}

export function IngredientToggleButton({uniqueID, ingredient, selected}: IngredientToggleButtonProps) {
    const [select, setSelect] = useState<boolean>(selected);

        function toggle() {
        if(select) {
            setSelect(false)
        }
        else {
            setSelect(true)
        }
    }

    if(select)
    {
        return (
            <button id={"ingredButton"+uniqueID} className="bg-green-300 text-black rounded hover:bg-green-400" value="selected" onClick={()=>toggle()}>{ingredient.name}</button>
          )
    }   
    else
    {
        return (
            <button id={"ingredButton"+uniqueID} className="bg-red-300 text-black rounded hover:bg-red-400" value="unselected" onClick={()=>toggle()}>{ingredient.name}</button>
          )
    }
 
}