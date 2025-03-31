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

    // function toggle(event:React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        function toggle() {
        if(select) {
            setSelect(false)
            // event.buttons
            const element = document.getElementById("ingredButton"+uniqueID)
            if(element)
            {
                element.className = "text-blue-400"
            }
        }
        else {
            setSelect(true)
            const element = document.getElementById("ingredButton"+uniqueID)
            if(element)
            {
                element.className = "text-red-400"
            }
        }
    }

    if(select)
    {
        return (
            <button id={"ingredButton"+uniqueID} className="text-red-400" value="selected" onClick={()=>toggle()}>{ingredient.name}</button>
          )
    }   
    else
    {
        return (
            <button id={"ingredButton"+uniqueID} className="text-blue-400" value="unselected" onClick={()=>toggle()}>{ingredient.name}</button>
          )
    }
 
}