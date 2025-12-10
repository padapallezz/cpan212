import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import BepChart from "../components/Bep/BepChart";
import BepForm from "../components/Bep/BepForm";

const BepDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bep, setBep] = useState(null);

  const fetchBep = async () => {
    try {
      const res = await axios.get(`/bep/${id}`);
      setBep(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch BEP");
    }
  };

  useEffect(() => { fetchBep(); }, [id]);

  const handleUpdate = async (updatedBep) => {
    try {
      const res = await axios.put(`/bep/${id}`, updatedBep);
      setBep(res.data);
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
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 text-blue-700">BEP Scenario: {bep.product_name}</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/3 bg-white shadow-lg rounded-xl p-6">
          <BepForm onSubmit={handleUpdate} initialData={bep} />
          <button
            onClick={handleDelete}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Delete Scenario
          </button>
        </div>

        <div className="lg:w-2/3 bg-white shadow-lg rounded-xl p-6">
          <BepChart bep={bep} />
        </div>
      </div>
    </div>
  );
};

export default BepDetailPage;
