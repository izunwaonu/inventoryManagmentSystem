"use client"
import { useState, useEffect } from "react";

const SellPage = () => {
  const [items, setItems] = useState([]); // Store items fetched from the backend
  const [selectedItem, setSelectedItem] = useState(null); // Track the selected item
  const [quantityAvailable, setQuantityAvailable] = useState(0); // Available quantity of the selected item
  const [quantityToSell, setQuantityToSell] = useState(""); // Quantity entered by the user
  const [message, setMessage] = useState(""); // Feedback message for the user

  // Fetch items from the backend on component mount
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch("/api/items"); //  GET API endpoint
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error("Error fetching items:", error);
        setMessage("Failed to load items. Please try again later.");
      }
    };
    fetchItems();
  }, []);

  // Handle item selection
  const handleItemChange = (e) => {
    const selectedId = e.target.value;
    const item = items.find((i) => i.id === selectedId);
    if (item) {
      setSelectedItem(item);
      setQuantityAvailable(item.quantity); // Display the current stock
    } else {
      setSelectedItem(null);
      setQuantityAvailable(0);
    }
  };

  // Handle selling items
  const handleSell = async (e) => {
    e.preventDefault();

    if (!selectedItem || !quantityToSell || quantityToSell <= 0) {
      setMessage("Please select an item and enter a valid quantity.");
      return;
    }

    if (quantityToSell > quantityAvailable) {
      setMessage("Insufficient stock for the selected item.");
      return;
    }

    try {
      const response = await fetch("/api/sell", { // Replace with your POST API endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemId: selectedItem.id,
          quantity: quantityToSell,
        }),
      });

      if (response.ok) {
        const updatedItem = await response.json();
        setItems((prevItems) =>
          prevItems.map((item) =>
            item.id === updatedItem.id ? { ...item, quantity: updatedItem.quantity } : item
          )
        );
        setQuantityAvailable(updatedItem.quantity); // Update displayed quantity
        setMessage("Item sold successfully!");
        setQuantityToSell(""); // Reset quantity input
      } else {
        setMessage("Failed to sell the item. Please try again.");
      }
    } catch (error) {
      console.error("Error selling item:", error);
      setMessage("Failed to sell the item. Please try again.");
    }
  };

  return (
    <div className=" text-white p-8  flex flex-col items-center justify-center gap-10  bg-slate-600 focus:ring-rose-300">
      <h1 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">Point of Sale</h1>
      {message && <p className="text-red-500">{message}</p>}
      <div className=" text-slate-900 p-8  flex flex-col items-center justify-center gap-10">
      <form onSubmit={handleSell}>
        {/* Item Selection */}
        <label htmlFor="item">Products:</label>
        <select id="item" onChange={handleItemChange} defaultValue="">
          <option value="" disabled>
            Select Product
          </option>
          {items.map((item) => (
            <option key={item.id} value={item.id}>
              {item.title}
            </option>
          ))}
        </select>

        {/* Quantity Available */}
        {selectedItem && (
          <p>Available Quantity: {quantityAvailable}</p>
        )}

        {/* Quantity Input */}
        <label htmlFor="quantity">Quantity to Sell:</label>
        <input
          type="number"
          id="quantity"
          value={quantityToSell}
          onChange={(e) => setQuantityToSell(e.target.value)}
          min="1"
        />

        <button type="submit" className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Sell</button>
      </form>
      </div>
    </div>
  );
};

export default SellPage;
