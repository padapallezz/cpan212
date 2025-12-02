import React, { useState, useEffect } from "react";

const BepForm = ({ initialData = null, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    fixedCost: "",
    variableCost: "",
    price: ""
  });

  // Load data nếu edit
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name.trim()) {
      alert("Name is required");
      return;
    }
    if (!formData.fixedCost || isNaN(formData.fixedCost)) {
      alert("Fixed cost must be a number");
      return;
    }
    if (!formData.variableCost || isNaN(formData.variableCost)) {
      alert("Variable cost must be a number");
      return;
    }
    if (!formData.price || isNaN(formData.price)) {
      alert("Price must be a number");
      return;
    }

    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", width: "300px", gap: "10px" }}
    >
      <h2>{initialData ? "Edit BEP" : "Add New BEP"}</h2>

      <input
        name="name"
        placeholder="Product name"
        value={formData.name}
        onChange={handleChange}
      />

      <input
        name="fixedCost"
        placeholder="Fixed Cost"
        value={formData.fixedCost}
        onChange={handleChange}
      />

      <input
        name="variableCost"
        placeholder="Variable Cost"
        value={formData.variableCost}
        onChange={handleChange}
      />

      <input
        name="price"
        placeholder="Price per Unit"
        value={formData.price}
        onChange={handleChange}
      />

      <button type="submit">{initialData ? "Update" : "Create"}</button>
    </form>
  );
};

export default BepForm;
