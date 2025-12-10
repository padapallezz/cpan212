import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios";
import RevenueForm from "../components/Revenue/RevenueForm"; // form chỉ có month, year, file upload

export default function RevenueDetailsPage() {
  const { year, month } = useParams();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false); // show/hide form

  const fetchMonthlyData = async () => {
    try {
      const res = await axios.get(`/revenue/by-month/${year}/${month}`);
      setRecords(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMonthlyData();
  }, [year, month]);

  if (loading) return <p className="p-6 text-lg">Loading...</p>;

  // Calculate totals
  const totalRevenue = records.reduce((sum, r) => sum + r.revenue, 0);
  const totalProfit = records.reduce((sum, r) => sum + r.profit, 0);
 
  // Handlers
  const handleEdit = () => setEditing(true);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this revenue?")) return;
    try {
      await axios.delete(`/revenue/${year}/${month}`);
      alert("Revenue deleted");
      // redirect to main revenue page
      window.location.href = "/revenue";
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const handleFormSubmit = async (formData) => {
  try {
    await axios.put(`/revenue/${year}/${month}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    alert("Revenue updated successfully!");
    setEditing(false);
    fetchMonthlyData();
  } catch (err) {
    console.error(err);
    alert("Update failed");
  }
};


  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">
        Revenue Details — {month}/{year}
      </h1>

      {/* Edit/Delete Buttons */}
      <div className="mb-6 flex gap-2">
        <button
          className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded"
          onClick={handleEdit}
        >
          Edit
        </button>
        <button
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>

      {/* Revenue Form (for editing) */}
      {editing && (
        <RevenueForm
          initialData={{ month, year }}
          onSubmit={handleFormSubmit}
          onCancel={() => setEditing(false)}
        />
      )}

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-blue-100 rounded shadow text-center">
          <p className="text-sm font-semibold">Total Invoices</p>
          <p className="text-xl font-bold">{records.length}</p>
        </div>
        <div className="p-4 bg-green-100 rounded shadow text-center">
          <p className="text-sm font-semibold">Total Revenue</p>
          <p className="text-xl font-bold">${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="p-4 bg-yellow-100 rounded shadow text-center">
          <p className="text-sm font-semibold">Total Profit</p>
          <p className="text-xl font-bold">${totalProfit.toFixed(2)}</p>
        </div>
      </div>

      {/* Invoices + Products */}
      {records.map((invoice) => (
        <div
          key={invoice._id}
          className="mb-8 border rounded-lg shadow p-5 bg-white"
        >
          <h2 className="text-xl font-bold mb-3 text-blue-600">
            Invoice #{invoice.invoice} — {invoice.company}
          </h2>

          <p className="mb-2">
            <span className="font-semibold">Revenue:</span> ${invoice.revenue.toFixed(2)}
          </p>
          <p className="mb-2">
            <span className="font-semibold">Profit:</span> ${invoice.profit.toFixed(2)}
          </p>
          <p className="mb-4">
            <span className="font-semibold">Fixed Cost:</span> ${invoice.fixed_cost.toFixed(2)}
          </p>

          {/* Products Table */}
          <table className="w-full mt-4 border-collapse">
            <thead>
              <tr className="bg-gray-100">
                {["Product","Units Sold","Price","Variable Cost","Revenue","Profit"].map(h => (
                  <th key={h} className="border px-2 py-2 text-sm">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {invoice.products.map((p,i) => {
                const productRevenue = p.units_sold * p.price;
                const productProfit = p.units_sold * p.price - p.units_sold * p.variable_cost;
                return (
                  <tr key={i} className="text-center">
                    <td className="border px-2 py-1">{p.name}</td>
                    <td className="border px-2 py-1">{p.units_sold}</td>
                    <td className="border px-2 py-1">${p.price}</td>
                    <td className="border px-2 py-1">${p.variable_cost}</td>
                    <td className="border px-2 py-1">${productRevenue.toFixed(2)}</td>
                    <td className="border px-2 py-1 text-green-600 font-semibold">${productProfit.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
