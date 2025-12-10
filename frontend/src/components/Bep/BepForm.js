import React, { useState } from "react";

const BepForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    product_name: "",
    fixed_cost: "",
    variable_cost_per_unit: "",
    selling_price_per_unit: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.product_name || formData.product_name.length < 3)
      newErrors.product_name = "Product name must be at least 3 characters";
    
    ["fixed_cost", "variable_cost_per_unit", "selling_price_per_unit"].forEach((field) => {
      if (formData[field] === "" || Number(formData[field]) < 0)
        newErrors[field] = `${field.replace(/_/g, " ")} must be a positive number`;
    });

    const variable = Number(formData.variable_cost_per_unit);
    const selling = Number(formData.selling_price_per_unit);

    if (!newErrors.variable_cost_per_unit && !newErrors.selling_price_per_unit) {
      if (selling <= variable) {
        newErrors.selling_price_per_unit = "Selling price per unit must be greater than variable cost per unit";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // calculate BEP units
    const bep_unit = Math.ceil(
      Number(formData.fixed_cost) / (Number(formData.selling_price_per_unit) - Number(formData.variable_cost_per_unit))
    );

    onSubmit({ ...formData, bep_unit });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        name="product_name"
        placeholder="Product Name"
        value={formData.product_name}
        onChange={handleChange}
        className={`border p-2 rounded ${errors.company_name ? "border-red-500" : ""}`}
      />
      {errors.product_name && <p className="text-red-600 text-sm">{errors.product_name}</p>}

      <input
        name="fixed_cost"
        placeholder="Fixed Cost"
        type="number"
        value={formData.fixed_cost}
        onChange={handleChange}
        className={`border p-2 rounded ${errors.fixed_cost ? "border-red-500" : ""}`}
      />
      {errors.fixed_cost && <p className="text-red-600 text-sm">{errors.fixed_cost}</p>}

      <input
        name="variable_cost_per_unit"
        placeholder="Variable Cost per Unit"
        type="number"
        value={formData.variable_cost_per_unit}
        onChange={handleChange}
        className={`border p-2 rounded ${errors.variable_cost_per_unit ? "border-red-500" : ""}`}
      />
      {errors.variable_cost_per_unit && (
        <p className="text-red-600 text-sm">{errors.variable_cost_per_unit}</p>
      )}

      <input
        name="selling_price_per_unit"
        placeholder="Selling Price per Unit"
        type="number"
        value={formData.selling_price_per_unit}
        onChange={handleChange}
        className={`border p-2 rounded ${errors.selling_price_per_unit ? "border-red-500" : ""}`}
      />
      {errors.selling_price_per_unit && (
        <p className="text-red-600 text-sm">{errors.selling_price_per_unit}</p>
      )}

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Save BEP Scenario
      </button>
    </form>
  );
};

export default BepForm;
