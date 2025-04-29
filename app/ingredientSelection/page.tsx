'use client'
import React, {useEffect, useState, Suspense} from 'react'
import Image from "next/image"
import { useCart, Item, Ingredient} from '@/components/cartContext'
import {IngredientToggleButton} from '@/components/ingredientToggleButton'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { translatePage } from '@/components/googleTranslateFunction'

function IngredientSelectionContent() {
  const searchParams = useSearchParams()
  const itemID = searchParams.get("itemid")
  const itemPrice = searchParams.get("itemprice")
  const {addToCart, language}  = useCart();

  if(!itemID)
    return;

  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [defaultIngredientIds, setDefaultIngredientIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  const tempItem = {
    itemid:-1,
    name:"Loading Item Name",
    quantity: -1,
    price: "",
    category: "",
    ingredients:[]

  }
  const [currentItem, setCurrentItem] = useState<Item>(tempItem);

  // Translate the page into the user's currently selected language after done loading.
  useEffect(()=>{
    if(!loading)
      translatePage(language)
  },[loading])

  useEffect(() => {
      fetchIngredients();
    }, []);
  
  async function fetchIngredients() {
    try {
      // Getting ingredients
      const response = await fetch(`/api/ingredientSelection?itemID=${encodeURIComponent(itemID || "")}`, {method: 'Get'});
      if (!response.ok)
          throw new Error("Failed to fetch ingredients");
      const data = await response.json();

      // Setting current item
      const currItemSetup:Item = {
        itemid: data.currentItem[0].itemid,
        name:data.currentItem[0].name,
        quantity:1,
        price:itemPrice || data.currentItem[0].price,
        category: data.currentItem[0].category,
        ingredients:[]
      }
      setCurrentItem((i)=>currItemSetup)

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
      
    } catch (error) {
      console.error("Error fetching ingredients:", error);
    } finally {
      setLoading(false);
    }
  }

  function addSelectedItemToCart() {
    const selectedIngredients: Ingredient[] = []
    // Get all ingredients that are selected
    for(let i=0; i<ingredients.length; i++)
    {
      const element = document.getElementById("ingredButton"+ingredients[i].ingredientid) as HTMLButtonElement
      if(element)
      {
        if(element.value === "selected")
        {
          selectedIngredients.push(ingredients[i])
        }
      }
    }

    // Get the quantity that is selected
    const quantityRadioButtons = document.getElementsByName("quantityRadio") as NodeListOf<HTMLInputElement>
    let finalQuantity = 1
    for(let i=0; i<quantityRadioButtons.length; i++) {
      if(quantityRadioButtons[i].checked) {
          finalQuantity=Number(quantityRadioButtons[i].value)
      }
    }

    // Add the current item, the selected ingredients, and the final quantity to the cart
    addToCart( {...currentItem, quantity: finalQuantity, ingredients:selectedIngredients})
  }

  return (
    <>
      <title>TeaShare - Select Ingredients</title>
      <div className="bg-gray-100 min-h-screen">
        <header className="w-full bg-red-700 text-white py-6">
          <h1 className="text-4xl font-bold text-center">Ingredient Selection</h1>
          <p className="text-center mt-2 text-lg">Customize your drink exactly how you want it</p>
        </header>

        {/* Show upper portion, make it column if the thing is to high */}
          <div className="flex flex-col md:flex-row justify-center">
            <div className="grow w-full md:w-2/5 border-l-2 border-r-2 border-b-2 border-gray-400 pt-4 pb-3 px-15 flex flex-row">
            <Image 
              className="w-72" 
              src="/Pearl+Milk+Tea.jpg" 
              width = {100} 
              height = {100} 
              alt="Image of Item Just Selected"/
            >
            <div className="ml-2">
              <h2 className="text-2xl font-semibold text-black underline">{(currentItem) ? currentItem.name : "Item name not found"}</h2>
              <p className="text-md text-black">{(loading) ? "This item" : currentItem.name} is classic, fresh, and delicious. It is prepared daily on-site using only the finest ingredients.</p>
            </div>
          </div>  
          <div className="grow w-full md:w-2/5 border-l-2 border-r-2 border-b-0 md:border-b-2 border-gray-400 content-center pt-4 pb-3 px-15">
            <h2 className="text-2xl font-semibold text-black justify-self-center underline">Select Item Amount</h2>
            <div className="grid grid-cols-10 justify-items-center">
              <label className="text-black" htmlFor="radio1">1</label>
              <label className="text-black" htmlFor="radio2">2</label>
              <label className="text-black" htmlFor="radio3">3</label>
              <label className="text-black" htmlFor="radio4">4</label>
              <label className="text-black" htmlFor="radio5">5</label>
              <label className="text-black" htmlFor="radio6">6</label>
              <label className="text-black" htmlFor="radio7">7</label>
              <label className="text-black" htmlFor="radio8">8</label>
              <label className="text-black" htmlFor="radio9">9</label>
              <label className="text-black" htmlFor="radio10">10</label>
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

        {/* This is the main body for selecting ingredients */}
        <div>
          <hr className="bg-gray-400 border-0 h-0.5"></hr>
          <h2 className="text-xl font-semibold text-black justify-self-center mb-1 underline">Default Ingredients</h2>
          <a
            href="#finishSelection"
            className="sr-only focus:not-sr-only text-2xl text-blue-700 underline"
          >
            <p>
            Skip to Cancel/Confirm Selection</p>
          </a>
          <div className = "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 px-3">
          {
            ingredients.map((ingred) => (
                defaultIngredientIds.has(ingred.ingredientid) ?
                  <IngredientToggleButton key={ingred.ingredientid} uniqueID={ingred.ingredientid} ingredient={ingred} selected={defaultIngredientIds.has(ingred.ingredientid)}></IngredientToggleButton>
                  : <div key = {ingred.ingredientid*10000} className="hidden"></div>
              ))
          }
          </div>
          <hr className="bg-gray-400 border-0 h-0.5 m-1 mt-3"></hr>
          <h2 className="text-xl font-semibold text-black justify-self-center mb-1 underline">Additional Ingredients</h2>
          <div className = "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 px-3">
          {
            ingredients.map((ingred) => (
              !defaultIngredientIds.has(ingred.ingredientid) ?
                <IngredientToggleButton key={ingred.ingredientid} uniqueID={ingred.ingredientid} ingredient={ingred} selected={defaultIngredientIds.has(ingred.ingredientid)}></IngredientToggleButton>
                : <div key = {ingred.ingredientid*10000} className="hidden"></div>
            ))
          }
          </div>
          <hr className="bg-gray-400 border-0 h-0.5 m-1 mt-3"></hr>
        </div>

        <div className = "flex flex-col md:flex-row justify-evenly m-5">
          <Link 
            id="finishSelection"
            href={{ pathname: "/itemSelection", query: { category: currentItem.category } }}
            className="text-lg text-white text-center bg-red-700 rounded hover:bg-red-900 px-4 py-2"
          >
            <p>Cancel Item Selection</p>
          </Link>
          <Link href={{pathname:"/home"}} tabIndex={-1}>
            <button 
              className="text-lg w-full mt-4 md:mt-0 text-white bg-green-700 rounded hover:bg-green-900 px-4 py-2" 
              onClick={() => addSelectedItemToCart()}
            >
              Confirm Item Selection
            </button>
          </Link>
        </div>

        <footer className="w-full bg-red-700 text-white py-4 mt-5">
          <p className="text-center">© 2025 TeaShare. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
};

export default function IngredientSelectionPage() {
  return (
    <Suspense fallback={<p className="text-center mt-10">Loading...</p>}>
      <IngredientSelectionContent />
    </Suspense>
  );
}