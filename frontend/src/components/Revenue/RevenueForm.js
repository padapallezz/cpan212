import React, { useState, useEffect } from "react";

const RevenueForm = ({ initialData = null, onSubmit }) => {
  const [formData, setFormData] = useState({ name: "", amount: "" });

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.amount) {
      alert("Please fill all fields");
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        placeholder="Revenue Name"
        value={formData.name}
        onChange={handleChange}
      />
      <input
        name="amount"
        type="number"
        placeholder="Amount"
        value={formData.amount}
        onChange={handleChange}
      />
      <button type="submit">{initialData ? "Update" : "Create"}</button>
    </form>
  );
};

export default RevenueForm;
