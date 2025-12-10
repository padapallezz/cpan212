import React, { useState, useEffect } from "react";
import axios from "../api/axios";

export default function RevenueListPage() {
  const [revenues, setRevenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    company_like: "",
    year: "",
    month: "",
    revenue_min: "",
    revenue_max: "",
    profit_min: "",
    profit_max: "",
  });

  const [page, setPage] = useState(1);
  const limit = 20;

  const fetchRevenues = async () => {
    setLoading(true);
    try {
      const params = { ...filters, page, limit };
      const queryString = new URLSearchParams(params).toString();
      const res = await axios.get(`/revenue?${queryString}`);
      setRevenues(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch revenues");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRevenues();
  }, [filters, page]);

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleReset = () => {
    setFilters({
      company_like: "",
      year: "",
      month: "",
      revenue_min: "",
      revenue_max: "",
      profit_min: "",
      profit_max: "",
    });
    setPage(1);
  };

  if (loading) return <p className="p-6 text-lg">Loading...</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">All Revenues</h1>

      {/* Filter */}
      <div className="bg-white p-4 shadow rounded mb-6 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Company"
          name="company_like"
          value={filters.company_like}
          onChange={handleFilterChange}
          className="border px-3 py-2 rounded w-48"
        />
        <input
          type="number"
          placeholder="Year"
          name="year"
          value={filters.year}
          onChange={handleFilterChange}
          className="border px-3 py-2 rounded w-24"
        />
        <input
          type="number"
          placeholder="Month"
          name="month"
          value={filters.month}
          onChange={handleFilterChange}
          className="border px-3 py-2 rounded w-24"
        />
        <input
          type="number"
          placeholder="Revenue Min"
          name="revenue_min"
          value={filters.revenue_min}
          onChange={handleFilterChange}
          className="border px-3 py-2 rounded w-32"
        />
        <input
          type="number"
          placeholder="Revenue Max"
          name="revenue_max"
          value={filters.revenue_max}
          onChange={handleFilterChange}
          className="border px-3 py-2 rounded w-32"
        />
        <input
          type="number"
          placeholder="Profit Min"
          name="profit_min"
          value={filters.profit_min}
          onChange={handleFilterChange}
          className="border px-3 py-2 rounded w-32"
        />
        <input
          type="number"
          placeholder="Profit Max"
          name="profit_max"
          value={filters.profit_max}
          onChange={handleFilterChange}
          className="border px-3 py-2 rounded w-32"
        />
        
        <button
          onClick={handleReset}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          Reset
        </button>
      </div>

      {/* Table */}
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            {["Invoice", "Company", "Month", "Year", "Revenue", "Profit", "Fixed Cost"].map(
              (h) => (
                <th key={h} className="border px-2 py-2 text-sm">
                  {h}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {revenues.map((r) => (
            <tr key={r._id} className="text-center">
              <td className="border px-2 py-1">{r.invoice}</td>
              <td className="border px-2 py-1">{r.company}</td>
              <td className="border px-2 py-1">{r.month}</td>
              <td className="border px-2 py-1">{r.year}</td>
              <td className="border px-2 py-1">${r.revenue.toFixed(2)}</td>
              <td className="border px-2 py-1">${r.profit.toFixed(2)}</td>
              <td className="border px-2 py-1">${r.fixed_cost.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>Page {page}</span>
        <button
          disabled={revenues.length < limit}
          onClick={() => setPage((p) => p + 1)}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
