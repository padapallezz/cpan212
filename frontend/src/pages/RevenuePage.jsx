import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import RevenueForm from "../components/Revenue/RevenueForm";
import RevenueTable from "../components/Revenue/RevenueTable";
import RevenueChart from "../components/Revenue/RevenueChart";
import { Link } from "react-router-dom";


export default function RevenuePage() {
  const [revenues, setRevenues] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const fetchRevenues = async () => {
    try {
      const res = await axios.get("/revenue");
      setRevenues(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRevenues();
  }, []);

  const handleCreate = async (formData) => {
    try {
      await axios.post("/revenue", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Revenue created successfully!");
      setShowForm(false);
      fetchRevenues();
    } catch (err) {
      console.error(err);
      alert("Failed to create revenue");
    }
  };

  const handleDelete = async (year, month) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`/revenue/${year}/${month}`);
      fetchRevenues();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-700 mb-4">Revenue Dashboard</h1>
      <button
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Close Form" : "Add Revenue"}
      </button>

      {showForm && <RevenueForm onSubmit={handleCreate} />}
      
      {/* VIEW ALL revenue button */}
      <Link
        to="/all_revenues"
        className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        View All Revenue Scenarios
      </Link>

      <RevenueChart revenues={revenues} />

      <RevenueTable
        revenues={revenues}
        onDelete={handleDelete}
      />
    </div>
  );
}
