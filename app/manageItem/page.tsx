"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ManageItem() {
  interface Item {
    itemid: number;
    name: string;
    ingredientid: number;
    price: number;
    category: string;
  }

  const [items, setItems] = useState<Item[]>([]);
  const [showModal, setShowModal] = useState(false);
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
      const response = await fetch("/api/item");
      if (!response.ok) throw new Error("Failed to fetch items");
      const data = await response.json();
      setItems(data.items);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  }

  async function addItem() {
    if (!newItem.name || !newItem.category) {
      alert("Please fill in all fields.");
      return;
    }

    const itemData = {
      itemid: Math.floor(Math.random() * 10000), // Temporary ID
      ...newItem,
    };

    try {
      const response = await fetch("/api/item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemData),
      });

      if (!response.ok) throw new Error("Failed to add item");

      setItems([...items, itemData]);
      setShowModal(false);
      setNewItem({ name: "", ingredientid: 0, price: 0, category: "" });
    } catch (error) {
      console.error("Error adding item:", error);
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setNewItem((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "ingredientid" ? Number(value) : value,
    }));
  }

  async function removeItem(itemid: number) {
    try {
      const response = await fetch(`/api/item`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemid }),
      });
      if (!response.ok) throw new Error("Failed to remove item");
      setItems(items.filter((item) => item.itemid !== itemid));
    } catch (error) {
      console.error("Error removing item:", error);
    }
  }

  return (
    <div className="p-8 bg-gradient-to-b from-gray-50 to-gray-200 min-h-screen">
      <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-8">
        Manage Items
      </h1>
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => setShowModal(true)}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
        >
          Add Item
        </button>
        <ul className="space-y-5">
          {items.map((item) => (
            <li
              key={item.itemid}
              className="p-5 bg-white shadow-lg rounded-xl flex items-center justify-between border border-gray-200"
            >
              <div>
                <p className="text-xl font-semibold text-gray-800">
                  {item.name}
                </p>
                <p className="text-sm text-gray-600">
                  Category: {item.category}
                </p>
              </div>
              <button
                onClick={() => removeItem(item.itemid)}
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
