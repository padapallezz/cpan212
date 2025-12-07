import React, { useState } from "react";
import BepForm from "../components/Bep/BepForm";
import axios from "../api/axios";
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  ReferenceDot,
  Area,
} from "recharts";

const BepPage = () => {
  const [selectedBep, setSelectedBep] = useState(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null); // success/error message

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

  const generateChartData = (bep) => {
    if (!bep) return [];
    const data = [];
    const maxUnits = bep.bep_unit * 2;
    const step = Math.ceil(maxUnits / 50); // step nhỏ hơn để mượt
    for (let x = 0; x <= maxUnits; x += step) {
      const totalCost = bep.fixed_cost + bep.variable_cost_per_unit * x;
      const revenue = bep.selling_price_per_unit * x;
      const profit = revenue - totalCost;
      const profitPercent = ((profit / totalCost) * 100).toFixed(1);
      data.push({ units: x, totalCost, revenue, profit, profitPercent });
    }
    return data;
  };

  const chartData = generateChartData(selectedBep);

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
        {selectedBep && (
          <div className="lg:w-2/3 bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">
              Scenario: {selectedBep.scenario_name}
            </h2>
            <div style={{ width: "100%", height: 400 }}>
              <ResponsiveContainer>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="units"
                    label={{ value: "Units Sold", position: "insideBottom", offset: -5 }}
                  />
                  <YAxis label={{ value: "Amount ($)", angle: -90, position: "insideLeft" }} />
                  <Tooltip
                    formatter={(value, name, props) => {
                      if (name === "profit") return [`$${value}`, "Profit"];
                      if (name === "profitPercent") return [`${value}%`, "Profit %"];
                      return [`$${value}`, name];
                    }}
                  />
                  <Legend verticalAlign="top" height={36} />
                  {/* Vùng lỗ/lãi */}
                  <Area
                    type="monotone"
                    dataKey="profit"
                    stroke={false}
                    fill="red"
                    fillOpacity={0.2}
                    isAnimationActive={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="totalCost"
                    stroke="#f87171"
                    name="Total Cost"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#34d399"
                    name="Revenue"
                    strokeWidth={2}
                  />
                  <ReferenceDot
                    x={selectedBep.bep_unit}
                    y={selectedBep.selling_price_per_unit * selectedBep.bep_unit}
                    r={6}
                    fill="blue"
                    stroke="blue"
                    label={{ position: "top", value: "BEP", fill: "blue" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 bg-gray-50 p-4 rounded">
              <p>
                To break even, <strong>{selectedBep.company_name}</strong> must sell approximately{" "}
                <strong>{Math.round(selectedBep.bep_unit)}</strong> units in the "
                {selectedBep.scenario_name}" scenario.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Red area = loss, Green area = profit (visual approximation)
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BepPage;
