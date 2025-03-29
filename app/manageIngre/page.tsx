"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ManageIngredient() {
  interface Ingredient {
    ingredientid: number;
    name: string;
    numinstock: number;
    maxnum: number;
  }

  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newIngredient, setNewIngredient] = useState({
    name: "",
    numinstock: 0,
    maxnum: 0,
  });

  useEffect(() => {
    fetchIngredients();
  }, []);

  async function fetchIngredients() {
    try {
      const response = await fetch("/api/ingredient");
      if (!response.ok) throw new Error("Failed to fetch ingredients");
      const data = await response.json();
      setIngredients(data.ingredients);
    } catch (error) {
      console.error("Error fetching ingredients:", error);
    }
  }

  async function addIngredient() {
    if (!newIngredient.name) {
      alert("Please fill in all fields.");
      return;
    }

    const ingredientData = {
      ingredientid: Math.floor(Math.random() * 10000), // Temporary ID
      ...newIngredient,
    };

    try {
      const response = await fetch("/api/ingredient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ingredientData),
      });

      if (!response.ok) throw new Error("Failed to add ingredient");

      setIngredients([...ingredients, ingredientData]);
      setShowModal(false);
      setNewIngredient({ name: "", numinstock: 0, maxnum: 0 });
    } catch (error) {
      console.error("Error adding ingredient:", error);
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setNewIngredient((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  }

  async function removeIngredient(ingredientid: number) {
    try {
      const response = await fetch(`/api/ingredient`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredientid }),
      });
      if (!response.ok) throw new Error("Failed to remove ingredient");
      setIngredients(
        ingredients.filter(
          (ingredient) => ingredient.ingredientid !== ingredientid
        )
      );
    } catch (error) {
      console.error("Error removing ingredient:", error);
    }
  }

  return (
    <div className="p-8 bg-gradient-to-b from-gray-50 to-gray-200 min-h-screen">
      <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-8">
        Manage Ingredients
      </h1>
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => setShowModal(true)}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
        >
          Add Ingredient
        </button>
        <ul className="space-y-5">
          {ingredients.map((ingredient) => (
            <li
              key={ingredient.ingredientid}
              className="p-5 bg-white shadow-lg rounded-xl flex items-center justify-between border border-gray-200"
            >
              <div>
                <p className="text-xl font-semibold text-gray-800">
                  {ingredient.name}
                </p>
                <p className="text-sm text-gray-600">
                  Stock: {ingredient.numinstock} / {ingredient.maxnum}
                </p>
              </div>
              <button
                onClick={() => removeIngredient(ingredient.ingredientid)}
                className="px-3 py-1 bg-red-500 text-white rounded-lg shadow hover:bg-red-600"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
