"use client"
import { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Dashboard = () => {
  const [topItems, setTopItems] = useState([]); // Store the top 5 items
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // Error state

  // Fetch the top 5 items from the backend
  useEffect(() => {
    const fetchTopItems = async () => {
      try {
        const response = await fetch("/api/top-items"); // R API endpoint
        const data = await response.json();
        setTopItems(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching top items:", error);
        setError("Failed to load top items");
        setLoading(false);
      }
    };

    fetchTopItems();
  }, []);

  if (loading) return <p>Loading... Please wait</p>;
  if (error) return <p>{error}</p>;

  // Prepare data for the bar chart
  const chartData = {
    // labels: topItems.map((item) => item.title), // Item titles as labels
    labels: topItems.map((item) => item.title.split(" ")[0]), // Extract the first word as label
    datasets: [
      {
        label: "Quantity",
        data: topItems.map((item) => item.quantity), // Quantities as data points
        backgroundColor: "rgba(75, 192, 192, 0.6)", // Bar color
        borderColor: "rgba(75, 192, 192, 1)", // Border color
        borderWidth: 1, // Border width
      },
    ],
  };

  return (
    <div>
            {/* Display top 5 items as a list */}
      <h2 className="font-semibold text-l text-blue-600 ">Top 5 Products with Highest Quantity</h2>
      <ol>
        {topItems.map((item) => (
          <li className=" text-sm text-blue-900" key={item.id}>
            {item.title}: <span className=" text-sm text-red-500"> {item.quantity}</span>
          </li>
        ))}
      </ol>

      {/* Display the bar chart */}
      {/* <h2 className="font-semibold text-sm text-pink-600 ">Top 5 Products (Bar Chart)</h2> */}
      <Bar data={chartData} options={{ responsive: true }} />
      
      
    </div>
  );
};

export default Dashboard;
