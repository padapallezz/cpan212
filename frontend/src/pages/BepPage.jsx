import React, { useState } from "react";
import BepForm from "../components/Bep/BepForm";
import BepChart from "../components/Bep/BepChart";
import axios from "../api/axios";
import { Link } from "react-router-dom";

const BepPage = () => {
  const [selectedBep, setSelectedBep] = useState(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null); 

  const handleCreate = async (data) => {
    try {
      setLoading(true);
      setFeedback(null);
      const res = await axios.post("/bep", data); 
      setSelectedBep(res.data);
      setFeedback({ type: "success", message: "BEP scenario created successfully!" });
      setLoading(false);
    } catch (err) {
      console.error("Axios error:", err.response?.data || err.message);
      setFeedback({ type: "error", message: err.response?.data?.message || err.message });
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 text-blue-700">Break-Even Analysis</h1>
      {/* Intro */}
      <div className="mb-6 bg-blue-50 p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">What is Break-Even Point (BEP)?</h2>
        <p className="text-gray-700 mb-2">
          The Break-Even Point is the number of units a company must sell to cover all fixed and variable costs. 
          At this point, profit is zero.
        </p>
        <h3 className="font-semibold">Form Fields Explanation:</h3>
        <ul className="list-disc list-inside text-gray-700">
          <li><strong>Company Name:</strong> Your company's name.</li>
          <li><strong>Scenario Name:</strong> A name to identify this BEP scenario.</li>
          <li><strong>Fixed Cost:</strong> Costs that do not change regardless of units produced (e.g., rent, salaries).</li>
          <li><strong>Variable Cost per Unit:</strong> Costs per product unit (e.g., materials, labor per item).</li>
          <li><strong>Selling Price per Unit:</strong> The price you sell each unit for.</li>
          <li><strong>BEP Units:</strong> Automatically calculated number of units to break even.</li>
        </ul>
      </div>
      {/* View All BEP Button */}
        <Link
          to="/bep_list"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          View All BEP Scenarios
        </Link>
      {/* Feedback */}
      {feedback && (
        <div
          className={`mb-4 p-3 rounded ${
            feedback.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {feedback.message}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Form */}
        <div className="lg:w-1/3 bg-white shadow-lg rounded-xl p-6">
          <BepForm onSubmit={handleCreate} />
          {loading && <p className="mt-2 text-gray-500">Submitting...</p>}
        </div>

        {/* Chart */}
        {selectedBep && <BepChart bep={selectedBep} />}
      </div>
    </div>
  );
};

export default BepPage;
