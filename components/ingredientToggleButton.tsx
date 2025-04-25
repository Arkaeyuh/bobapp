'use client'
import React, {createContext, useState, useContext, ReactNode} from 'react';
import {Ingredient} from '@/components/cartContext'

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
            // Need the below code because when translate the button's text, 
            // it is prevented from updating the text via the if(select)/else return statement for some reason.
            // So need this to add the ✓/✕ manually. The style is still updated though even when translate the button.
            const thisElement = document.getElementById("ingredButton"+uniqueID)
            if(thisElement) {
                const currentText = thisElement.innerText
                thisElement.innerText = currentText.slice(0,thisElement.innerText.length-3) + "[✕]"
            }
        }
        else {
            setSelect(true)
            // Need the below code because when translate the button's text, 
            // it is prevented from updating the text via the if(select)/else return statement for some reason.
            // So need this to add the ✓/✕ manually. The style is still updated though even when translate the button.
            const thisElement = document.getElementById("ingredButton"+uniqueID)
            if(thisElement) {
                const currentText = thisElement.innerText
                thisElement.innerText = currentText.slice(0,thisElement.innerText.length-3) + "[✓]"
            }
        }
    }

    // Change the style/text of the button depending on whether it is toggled or not.
    if(select)
    {
        return (
            <button id={"ingredButton"+uniqueID} className="bg-green-300 text-black rounded hover:bg-green-400 border-2 border-green-500" value="selected" onClick={()=>toggle()}>{ingredient.name}[✓]</button>
          )
    }   
    else
    {
        return (
            <button id={"ingredButton"+uniqueID} className="bg-red-300 text-black rounded hover:bg-red-400 border-2 border-red-500" value="unselected" onClick={()=>toggle()}>{ingredient.name}[✕]</button>
          )
    }
 
}