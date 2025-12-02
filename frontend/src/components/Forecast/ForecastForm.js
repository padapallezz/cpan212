import React, { useState, useEffect } from "react";

const ForecastForm = ({ initialData = null, onSubmit }) => {
  const [formData, setFormData] = useState({ name: "", value: "" });

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.value || isNaN(formData.value)) {
      alert("Please enter valid name and numeric value");
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
      <input name="value" placeholder="Value" value={formData.value} onChange={handleChange} />
      <button type="submit">{initialData ? "Update" : "Create"}</button>
    </form>
  );
};

export default ForecastForm;
