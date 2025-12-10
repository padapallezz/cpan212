import React from "react";

const WhatIfForm = ({ scenario, onChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ [name]: Number(value) });
  };

  return (
    <div className="flex flex-col gap-4">
      {["scenario_name", "old_price", "new_price", "fixed_cost", "variable_cost", "units_sold"].map((field) => (
        <div key={field} className="flex flex-col">
          <label className="font-semibold">{field.replace(/_/g, " ")}</label>
          <input
            type={field === "scenario_name" ? "text" : "number"}
            name={field}
            value={scenario[field]}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>
      ))}
      <div>
        <label className="font-semibold">Expected Profit</label>
        <input type="number" value={scenario.expected_profit} disabled className="border p-2 rounded bg-gray-100" />
      </div>
    </div>
  );
};

export default WhatIfForm;
