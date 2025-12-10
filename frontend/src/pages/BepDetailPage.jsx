import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import BepChart from "../components/Bep/BepChart";
import BepForm from "../components/Bep/BepForm";

const BepDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bep, setBep] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const fetchBep = async () => {
    try {
      const res = await axios.get(`/bep/${id}`);
      setBep(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch BEP");
    }
  };

  useEffect(() => {
    fetchBep();
  }, [id]);

  const handleUpdate = async (updatedBep) => {
    try {
      const res = await axios.put(`/bep/${id}`, updatedBep);
      setBep(res.data);
      setEditMode(false);
      alert("Updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update BEP");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this BEP?")) return;
    try {
      await axios.delete(`/bep/${id}`);
      alert("Deleted successfully!");
      navigate("/bep_list");
    } catch (err) {
      console.error(err);
      alert("Failed to delete BEP");
    }
  };

  if (!bep) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-3xl font-bold mb-2 text-blue-700">
        BEP Scenario: {bep.product_name}
      </h1>

      {/* ===== BEP Info Section ===== */}
      <div className="bg-white rounded-xl shadow-lg p-6 space-y-3">
        <h2 className="text-xl font-semibold text-gray-700 mb-3">Details</h2>

        <p><strong>Product:</strong> {bep.product_name}</p>
        <p><strong>Fixed Cost:</strong> ${bep.fixed_cost}</p>
        <p><strong>Variable Cost / Unit:</strong> ${bep.variable_cost_per_unit}</p>
        <p><strong>Selling Price / Unit:</strong> ${bep.selling_price_per_unit}</p>
        <p><strong>BEP Units:</strong> {bep.bep_unit}</p>
        <p><strong>Created At:</strong> {new Date(bep.createdAt).toLocaleString()}</p>

        <div className="flex gap-4 mt-4">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => setEditMode(true)}
          >
            Edit
          </button>

          <button
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>

      {/*Edit Form (hidden until clicking EDIT)*/}
      {editMode && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">Edit Scenario</h2>

          <BepForm
            onSubmit={handleUpdate}
            initialData={bep}   
          />

          <button
            className="mt-4 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            onClick={() => setEditMode(false)}
          >
            Cancel
          </button>
        </div>
      )}

      {/* ===== Chart Section ===== */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <BepChart bep={bep} />
      </div>

    </div>
  );
};

export default BepDetailPage;
