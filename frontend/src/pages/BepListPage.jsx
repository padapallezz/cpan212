import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

const numericFields = [
  { key: "fixed_cost", label: "Fixed Cost" },
  { key: "variable_cost_per_unit", label: "Variable Cost/Unit" },
  { key: "selling_price_per_unit", label: "Price/Unit" },
  { key: "bep_unit", label: "BEP Units" },
];

const BepListPage = () => {
  const [beps, setBeps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const navigate = useNavigate();

  const fetchBeps = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([k, v]) => {
        if (v) params.append(k, v);
      });

      params.append("page", page);
      params.append("limit", limit);

      const res = await axios.get(`/bep?${params.toString()}`);
      setBeps(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to fetch BEP list");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBeps();
  }, [page, limit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchBeps();
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">BEP Scenarios List</h1>

      {/* Filter Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg mb-6 space-y-4">
  <h2 className="text-xl font-semibold text-blue-600">Filter Scenarios</h2>

  {/* Text Filters */}
  <div className="flex flex-wrap gap-4">
    <input
      name="product_name"
      value={filters.product_name || ""}
      onChange={handleChange}
      placeholder="Product Name"
      className="border p-2 rounded flex-1 min-w-[150px]"
    />
  </div>

  {/* Date Filters */}
  <div className="flex flex-wrap gap-4">
    <input
      type="date"
      name="createdAfter"
      value={filters.createdAfter || ""}
      onChange={handleChange}
      className="border p-2 rounded flex-1 min-w-[150px]"
    />
    <input
      type="date"
      name="createdBefore"
      value={filters.createdBefore || ""}
      onChange={handleChange}
      className="border p-2 rounded flex-1 min-w-[150px]"
    />
  </div>

  {/* Numeric Filters */}
  <div className="space-y-2">
    {numericFields.map((f) => (
      <div key={f.key} className="flex flex-wrap gap-2 items-center">
        <span className="w-32">{f.label}:</span>
        <input
          name={`${f.key}_min`}
          value={filters[`${f.key}_min`] || ""}
          onChange={handleChange}
          placeholder="Min"
          className="border p-2 rounded flex-1 min-w-[80px]"
        />
        <input
          name={`${f.key}_max`}
          value={filters[`${f.key}_max`] || ""}
          onChange={handleChange}
          placeholder="Max"
          className="border p-2 rounded flex-1 min-w-[80px]"
        />
      </div>
    ))}
  </div>

  <button
    type="submit"
    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
  >
    Apply Filters
  </button>
</form>


      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
        {loading ? (
          <p className="p-4">Loading...</p>
        ) : beps.length === 0 ? (
          <p className="p-4">No BEP scenarios found.</p>
        ) : (
          <table className="min-w-full">
            <thead className="bg-blue-100">
              <tr>
                <th className="py-2 px-4">Product Name</th>
                <th className="py-2 px-4">Fixed Cost</th>
                <th className="py-2 px-4">Variable Cost/Unit</th>
                <th className="py-2 px-4">Price/Unit</th>
                <th className="py-2 px-4">BEP Units</th>
                <th className="py-2 px-4">Created At</th>
              </tr>
            </thead>
            <tbody>
              {beps.map((bep) => (
                <tr
                  key={bep._id}
                  className="border-t hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/bep/${bep._id}`)}
                >
                  <td className="py-2 px-4">{bep.product_name}</td>
                  <td className="py-2 px-4">{bep.fixed_cost}</td>
                  <td className="py-2 px-4">{bep.variable_cost_per_unit}</td>
                  <td className="py-2 px-4">{bep.selling_price_per_unit}</td>
                  <td className="py-2 px-4">{bep.bep_unit}</td>
                  <td className="py-2 px-4">{new Date(bep.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          disabled={page === 1}
        >
          Prev
        </button>
        <span className="px-2 py-2">Page {page}</span>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BepListPage;
