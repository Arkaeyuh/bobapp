"use client";

import React, { useEffect, useState } from "react";

export default function ManageIngredient() {
  // Define the structure of an Ingredient object
  interface Ingredient {
    ingredientid: number;
    name: string;
    numinstock: number;
    maxnum: number;
  }

  // State to store the list of ingredients
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  // State to control the visibility of the "Add Ingredient" modal
  const [showModal, setShowModal] = useState(false);
  // State to store the currently selected ingredient for details view
  const [selectedIngredient, setSelectedIngredient] =
    useState<Ingredient | null>(null);
  // State to store the new ingredient being added
  const [newIngredient, setNewIngredient] = useState({
    name: "",
    numinstock: 0,
    maxnum: 0,
  });

  // Fetch ingredients when the component is mounted
  useEffect(() => {
    fetchIngredients();
  }, []);

  // Fetch the list of ingredients from the API
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

  // Add a new ingredient to the list
  async function addIngredient() {
    if (!newIngredient.name) {
      alert("Please fill in all fields.");
      return;
    }

    const ingredientData: Ingredient = {
      ingredientid: ingredients.length + 1, // Generate a new ID
      ...newIngredient,
    };

    try {
      const response = await fetch("/api/ingredient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ingredientData),
      });

      if (!response.ok) throw new Error("Failed to add ingredient");

      // Update the state with the new ingredient
      setIngredients([...ingredients, ingredientData]);
      setShowModal(false);
      setNewIngredient({ name: "", numinstock: 0, maxnum: 0 });
    } catch (error) {
      console.error("Error adding ingredient:", error);
    }
  }

  // Handle input changes for the "Add Ingredient" form
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setNewIngredient((prev) => ({
      ...prev,
      [name]: name === "name" ? value : Number(value), // Convert numeric fields to numbers
    }));
  }

  // Remove an ingredient from the list
  async function removeIngredient(ingredientid: number, e: React.MouseEvent) {
    e.stopPropagation(); // Prevent triggering parent click events
    try {
      const response = await fetch(`/api/ingredient`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredientid }),
      });
      if (!response.ok) throw new Error("Failed to remove ingredient");

      // Update the state to exclude the removed ingredient
      setIngredients(
        ingredients.filter((i) => i.ingredientid !== ingredientid)
      );
    } catch (error) {
      console.error("Error removing ingredient:", error);
    }
  }

  // Handle clicking on an ingredient to view its details
  function handleIngredientClick(ingredient: Ingredient) {
    setSelectedIngredient(ingredient);
  }

  // Close the ingredient details modal
  function closeIngredientModal() {
    setSelectedIngredient(null);
  }

  return (
    <div className="p-8 bg-gradient-to-b from-gray-50 to-gray-200 min-h-screen">
      <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-8">
        Manage Ingredients
      </h1>

      <div className="max-w-2xl mx-auto">
        {/* Button to open the "Add Ingredient" modal */}
        <button
          onClick={() => setShowModal(true)}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow opacity-90 transition hover:bg-blue-700 hover:opacity-100 hover:scale-105 duration-200"
        >
          Add Ingredient
        </button>

        {/* Button to navigate back to the home page */}
        <button
          onClick={() => (window.location.href = "/managerHome")}
          className="mb-4 ml-4 px-4 py-2 bg-green-600 text-white rounded-lg shadow opacity-90 transition hover:bg-green-700 hover:opacity-100 hover:scale-105 duration-200"
        >
          Home
        </button>

        {/* List of ingredients */}
        <ul className="space-y-5">
          {ingredients.map((ingredient) => (
            <li
              key={ingredient.ingredientid}
              className="p-5 bg-white shadow-lg rounded-xl flex items-center justify-between border border-gray-200 cursor-pointer transition-transform transform hover:scale-105 hover:shadow-2xl hover:bg-gray-100 hover:shadow-gray-400 duration-200"
              onClick={() => handleIngredientClick(ingredient)}
            >
              <div>
                <p className="text-xl font-semibold text-gray-800">
                  {ingredient.name}
                </p>
                <p className="text-sm text-gray-600">
                  Stock: {ingredient.numinstock} / {ingredient.maxnum}
                </p>
              </div>
              {/* Button to remove the ingredient */}
              <button
                onClick={(e) => removeIngredient(ingredient.ingredientid, e)}
                className="px-3 py-1 bg-red-500 text-white rounded-lg shadow opacity-90 hover:bg-red-600 hover:opacity-100 transition hover:scale-105 duration-200"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Modal for adding a new ingredient */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-950 bg-opacity-70">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-80 animate-fade-in">
            <h2 className="text-2xl font-bold mb-4 text-white">
              Add New Ingredient
            </h2>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={newIngredient.name}
              onChange={handleInputChange}
              className="mb-2 w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-white bg-gray-900"
            />
            <div className="mb-2">
              <label className="block text-sm font-medium text-white mb-1">
                Number in stock
              </label>
              <input
                type="number"
                name="numinstock"
                value={newIngredient.numinstock}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-white bg-gray-900"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-white mb-1">
                Max number
              </label>
              <input
                type="number"
                name="maxnum"
                value={newIngredient.maxnum}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-white bg-gray-900"
              />
            </div>
            <div className="flex justify-end">
              {/* Button to cancel adding a new ingredient */}
              <button
                onClick={() => setShowModal(false)}
                className="mr-2 px-4 py-2 bg-gray-300 text-gray-900 rounded hover:bg-gray-400 transition duration-200"
              >
                Cancel
              </button>
              {/* Button to confirm adding a new ingredient */}
              <button
                onClick={addIngredient}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition hover:scale-105 duration-200"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for viewing ingredient details */}
      {selectedIngredient && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-950 bg-opacity-70">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-80 animate-fade-in">
            <h2 className="text-2xl font-bold mb-4 text-gray-100">
              Ingredient Details
            </h2>
            <p className="text-gray-200">
              <strong>ID:</strong> {selectedIngredient.ingredientid}
            </p>
            <p className="text-gray-200">
              <strong>Name:</strong> {selectedIngredient.name}
            </p>
            <p className="text-gray-200">
              <strong>Stock:</strong> {selectedIngredient.numinstock} /{" "}
              {selectedIngredient.maxnum}
            </p>
            {/* Button to close the ingredient details modal */}
            <button
              onClick={closeIngredientModal}
              className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition hover:scale-105 duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
