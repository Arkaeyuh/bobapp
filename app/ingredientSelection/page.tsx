'use client'
import React, {useEffect, useState} from 'react'
import Image from "next/image"
import { useCart, Item, Ingredient} from '@/components/cartContext'
import {IngredientToggleButton} from '@/components/ingredientToggleButton'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function ingredientSelection()
{
    const searchParams = useSearchParams()
    const itemID = searchParams.get("itemid")
    const {cart, addToCart}  = useCart();

    if(!itemID)
      return

    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [defaultIngredientIds, setDefaultIngredientIds] = useState<Set<number>>(new Set());
    // const [ingredientToggleButtons, setingredientToggleButtons] = useState<React.JSX.Element[]>([]);
    const tempItem = {
      itemid:-1,
      name:"Loading Item Name",
      quantity: -1,
      price: "",
      category: "",
      ingredients:[]

    }
    const [currentItem, setCurrentItem] = useState<Item>(tempItem);

    useEffect(() => {
        fetchIngredients();
      }, []); //TODO -> might need to change to run more than on mount?

      // Update the ingredient toggle buttons once, ingredients is fully done updating
      // useEffect(() => {
      //   setingredientToggleButtons((iTB)=>ingredients.map((ingred, index) => (
      //     <IngredientToggleButton key={index} uniqueID={index} ingredient={ingred} selected={defaultIngredientIds.has(ingred.ingredientid)}></IngredientToggleButton>
      //     )))
      // }, [ingredients]);
    
    async function fetchIngredients() {
      try {
        // Getting ingredients
        const response = await fetch(`/api/ingredientSelection?itemID=${encodeURIComponent(itemID || "")}`, {method: 'Get'});
        if (!response.ok)
            throw new Error("Failed to fetch ingredients");
        const data = await response.json();

        // Setting current item
        const tempItem:Item = {
          itemid: data.currentItem[0].itemid,
          name:data.currentItem[0].name,
          quantity:1,
          price:data.currentItem[0].price,
          category: data.currentItem[0].category,
          ingredients:[]
        }
        setCurrentItem((i)=>tempItem)

        const defaultIngredients: Ingredient[] = data.defaultIngredients;
        // Adding default ingredient IDs to a set
        const defaultIngredientIdsTemp = new Set<number>()
        for (let i=0; i<defaultIngredients.length; i++)
        {
          defaultIngredientIdsTemp.add(defaultIngredients[i].ingredientid)
        }

        // Setting ingredients to be all ingredients available in the store
        setIngredients((i)=>data.ingredients);
        // Setting ingredients to not contain default ingredients
        setIngredients((i)=>i.filter((ingred) => !defaultIngredientIdsTemp.has(ingred.ingredientid)))
        // Sorting ingredients alphabetically
        setIngredients((i)=>i.toSorted(function (a,b){return a.name.localeCompare(b.name)}));
        // Sorting default ingredients then adding them to the beginning of ingredients
        setIngredients((i) => defaultIngredients.toSorted(function (a,b){return a.name.localeCompare(b.name)}).concat(...i))
        setDefaultIngredientIds((s)=>defaultIngredientIdsTemp)
        
        // setingredientToggleButtons((iTB)=>ingredients.map((ingred, index) => (
        //   <IngredientToggleButton key={index} uniqueID={index} ingredient={ingred} selected={defaultIngredientIds.has(ingred.ingredientid)}></IngredientToggleButton>
        //   )))

      } catch (error) {
        console.error("Error fetching ingredients:", error);
      }
    }

    function addSelectedItemToCart() {
      const selectedIngredients: Ingredient[] = []
      for(let i=0; i<ingredients.length; i++)
      {
        const element = document.getElementById("ingredButton"+ingredients[i].ingredientid)
        if(element)
        {
          if(element.className=== "text-red-400") // TODO make not bad
          {
            selectedIngredients.push(ingredients[i])
          }
        }
      }

      const quantityRadioButtons = document.getElementsByName("quantityRadio") as NodeListOf<HTMLInputElement>
      let finalQuantity = 1
      for(let i=0; i<quantityRadioButtons.length; i++) {
        if(quantityRadioButtons[i].checked) {
            finalQuantity=Number(quantityRadioButtons[i].value)
        }
      }
      
      addToCart( {...currentItem, quantity: finalQuantity, ingredients:selectedIngredients})
    }

    return(
        <div className="flex-col">
          <div className="flex justify-around border border-amber-200">
            <div className="border border-blue-200 w-2/5">
              <Image src="/Pearl+Milk+Tea.jpg" width = {100} height = {100} alt="Image of Item Just Selected" className="float-left w-64"/>
              <h2>{(currentItem) ? currentItem.name : "ITEM NAME NOT FOUND"}</h2>
              <p>What a great description</p>
            </div>
            <div className="border border-yellow-200 w-2/5">
              <h2> Quantity</h2>
              <div className="grid grid-cols-10 justify-items-center">
                <label htmlFor="radio1">1</label>
                <label htmlFor="radio2">2</label>
                <label htmlFor="radio3">3</label>
                <label htmlFor="radio4">4</label>
                <label htmlFor="radio5">5</label>
                <label htmlFor="radio6">6</label>
                <label htmlFor="radio7">7</label>
                <label htmlFor="radio8">8</label>
                <label htmlFor="radio9">9</label>
                <label htmlFor="radio10">10</label>
                <input type="radio" id="radio1" name="quantityRadio" value="1" defaultChecked></input>
                <input type="radio" id="radio2" name="quantityRadio" value="2"></input>
                <input type="radio" id="radio3" name="quantityRadio" value="3"></input>
                <input type="radio" id="radio4" name="quantityRadio" value="4"></input>
                <input type="radio" id="radio5" name="quantityRadio" value="5"></input>
                <input type="radio" id="radio6" name="quantityRadio" value="6"></input>
                <input type="radio" id="radio7" name="quantityRadio" value="7"></input>
                <input type="radio" id="radio8" name="quantityRadio" value="8"></input>
                <input type="radio" id="radio9" name="quantityRadio" value="9"></input>
                <input type="radio" id="radio10" name="quantityRadio" value="10"></input>
              </div>
            </div>
          </div>
          <div className = "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {
            ingredients.map((ingred) => (
              <IngredientToggleButton key={ingred.ingredientid} uniqueID={ingred.ingredientid} ingredient={ingred} selected={defaultIngredientIds.has(ingred.ingredientid)}></IngredientToggleButton>
              ))
          }
          </div>
          <div className = "flex justify-evenly">
          <Link href={{ pathname: "/itemSelection", query: { category: currentItem.category } }}>
            <button>Cancel</button>
          </Link>
            <button onClick={()=> {console.log(ingredients); console.log(cart)}}>||Display Ingredients/cart Array In Console||</button>
            <Link href={{pathname:"/home"}}>
              <button onClick={()=> addSelectedItemToCart()}>||Done||</button>
            </Link>
          </div>
        </div>
    )
}