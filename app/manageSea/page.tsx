"use client";

import React, { useEffect, useState } from "react";

export default function ManageItem() {
  interface Seasonal {
    seasonalid: number;
    name: string;
    ingredientid: number;
    price: number;
    category: string;
  }

  interface Item {
    itemid: number;
    name: string;
    ingredientid: number;
    price: number;
    category: string;
  }

  const [items, setItems] = useState<Seasonal[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Seasonal | null>(null);
  const [newItem, setNewItem] = useState({
    name: "",
    ingredientid: 0,
    price: 0,
    category: "",
  });

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    try {
      const response = await fetch("/api/seasonal");
      if (!response.ok) throw new Error("Failed to fetch seasonal");
      const data = await response.json();
      setItems(data.items);
    } catch (error) {
      console.error("Error fetching seasonal:", error);
    }
  }

  async function addItem() {
    if (!newItem.name || !newItem.category) {
      alert("Please fill in all fields.");
      return;
    }

    const itemData: Seasonal = {
      seasonalid: items.length + 1,
      ...newItem,
    };

    try {
      const response = await fetch("/api/seasonal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemData),
      });

      if (!response.ok) throw new Error("Failed to add seasonal");

      setItems([...items, itemData]);
      setShowModal(false);
      setNewItem({
        name: "",
        ingredientid: 0,
        price: 0,
        category: "",
      });
    } catch (error) {
      console.error("Error adding seasonal:", error);
    }
  }

  async function removeItem(itemid: number, e: React.MouseEvent) {
    e.stopPropagation();
    try {
      const response = await fetch(`/api/seasonal`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seasonalid: itemid }),
      });
      if (!response.ok) throw new Error("Failed to remove item");
      setItems(items.filter((i) => i.seasonalid !== itemid));
    } catch (error) {
      console.error("Error removing item:", error);
    }
  }

  function handleItemClick(item: Seasonal) {
    setSelectedItem(item);
  }

  function closeItemModal() {
    setSelectedItem(null);
  }

  async function mergeItems() {
    try {
      const response = await fetch("/api/seasonal");
      if (!response.ok) throw new Error("Failed to fetch seasonal items");
      const data = await response.json();
      const seasonalItems = data.items;

      const itemRes = await fetch("/api/item");
      if (!itemRes.ok) throw new Error("Failed to fetch existing items");
      const itemData = await itemRes.json();
      let len = itemData.items.length;

      for (const seasonalItem of seasonalItems) {
        const d = {
          itemid: ++len,
          name: seasonalItem.name,
          ingredientid: seasonalItem.ingredientid,
          price: seasonalItem.price,
          category: seasonalItem.category,
        };

        const res = await fetch("/api/item", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(d),
        });

        if (!res.ok) {
          console.error(
            `Failed to add item with ID ${seasonalItem.seasonalid}:`,
            await res.text()
          );
          continue;
        }
      }

      for (const item of seasonalItems) {
        await fetch("/api/seasonal", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ seasonalid: item.seasonalid }),
        });
      }

      setItems([]);

      alert("All seasonal items have been merged successfully.");
    } catch (error) {
      console.error("Error merging items:", error);
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setNewItem((prev) => ({
      ...prev,
      [name]: name === "name" || name === "category" ? value : Number(value),
    }));
  }

  return (
    <div className="p-8 bg-gradient-to-b from-gray-50 to-gray-200 min-h-screen">
      <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-8">
        Manage Seasonal Items
      </h1>

      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => setShowModal(true)}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow opacity-90 transition hover:bg-blue-700 hover:opacity-100 hover:scale-105 duration-200"
        >
          Add Seasonal Item
        </button>

        <button
          onClick={() => mergeItems()}
          className="mb-4 ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow opacity-90 transition hover:bg-blue-700 hover:opacity-100 hover:scale-105 duration-200"
        >
          Merge Seasonal Items
        </button>

        <button
          onClick={() => {
            window.location.href = "/manageItem";
          }}
          className="mb-4 ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow opacity-90 transition hover:bg-blue-700 hover:opacity-100 hover:scale-105 duration-200"
        >
          Manage Item
        </button>

        <ul className="space-y-5">
          {items.map((item) => (
            <li
              key={item.seasonalid}
              className="p-5 bg-white shadow-lg rounded-xl flex items-center justify-between border border-gray-200 cursor-pointer transition-transform transform hover:scale-105 hover:shadow-2xl hover:bg-gray-100 hover:shadow-gray-400 duration-200"
              onClick={() => handleItemClick(item)}
            >
              <div>
                <p className="text-xl font-semibold text-gray-800">
                  {item.name}
                </p>
                <p className="text-sm text-gray-600">
                  Price: ${item.price} | Category: {item.category}
                </p>
              </div>
              <button
                onClick={(e) => removeItem(item.seasonalid, e)}
                className="px-3 py-1 bg-red-500 text-white rounded-lg shadow opacity-90 hover:bg-red-600 hover:opacity-100 transition hover:scale-105 duration-200"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-950 bg-opacity-70">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-80 animate-fade-in">
            <h2 className="text-2xl font-bold mb-4 text-white">
              Add New Seasonal Item
            </h2>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={newItem.name}
              onChange={handleInputChange}
              className="mb-2 w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-white bg-gray-900"
            />
            <div className="mb-2">
              <label className="block text-sm font-medium text-white mb-1">
                Ingredient ID
              </label>
              <input
                type="number"
                name="ingredientid"
                value={newItem.ingredientid}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-white bg-gray-900"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium text-white mb-1">
                Price
              </label>
              <input
                type="number"
                step="0.01"
                name="price"
                value={newItem.price}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-white bg-gray-900"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-white mb-1">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={newItem.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-white bg-gray-900"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="mr-2 px-4 py-2 bg-gray-300 text-gray-900 rounded hover:bg-gray-400 transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={addItem}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition hover:scale-105 duration-200"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedItem && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-950 bg-opacity-70">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-80 animate-fade-in">
            <h2 className="text-2xl font-bold mb-4 text-gray-100">
              Seasonal Item Details
            </h2>
            <p className="text-gray-200">
              <strong>ID:</strong> {selectedItem.seasonalid}
            </p>
            <p className="text-gray-200">
              <strong>Name:</strong> {selectedItem.name}
            </p>
            <p className="text-gray-200">
              <strong>Ingredient ID:</strong> {selectedItem.ingredientid}
            </p>
            <p className="text-gray-200">
              <strong>Price:</strong> ${selectedItem.price}
            </p>
            <p className="text-gray-200">
              <strong>Category:</strong> {selectedItem.category}
            </p>
            <button
              onClick={closeItemModal}
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
