import React, { useState } from "react";
import WhatIfChart from "../components/WhatIf/WhatIfChart";
import WhatIfForm from "../components/WhatIf/WhatIfForm";
import axios from "../api/axios";

const WhatIfPage = () => {
  const [scenario, setScenario] = useState({
  scenario_name: "",
  old_price: 0,
  new_price: 0,
  fixed_cost: 0,
  variable_cost: 0,
  units_sold: 0,
  expected_profit: 0,
  adjustFor: "units_sold", // "units_sold" | "selling_price" | "variable_cost"
});


  const [saved, setSaved] = useState(false);

  const recalcFromProfit = (updated) => {
    const { new_price: P, variable_cost: V, fixed_cost: F, expected_profit: EP, adjustFor, units_sold: Q } = updated;
    const result = { ...updated };

    switch (adjustFor) {
      case "units_sold":
        result.units_sold = (EP + F) / (P - V);
        break;
      case "new_price":
        result.new_price = (EP + F) / Q + V;
        break;
      case "variable_cost":
        result.variable_cost = P - (EP + F) / Q;
        break;
      default:
        break;
    }

    return result;
  };


  const handleLiveUpdate = (updatedFields) => {
  setScenario((prev) => {
    let updated = { ...prev, ...updatedFields };

    // If expected profit was changed, recalc the chosen variable
    if ("expected_profit" in updatedFields) {
      updated = recalcFromProfit(updated);
    } else {
      // Otherwise recalc profit normally
      updated.expected_profit = (updated.units_sold * (updated.new_price - updated.variable_cost) - updated.fixed_cost);
    }

    return updated;
  });
};


  const handleSave = async () => {
    try {
      await axios.post("/whatif", scenario);
      alert("Scenario saved!");
      setSaved(true);
    } catch (err) {
      console.error(err);
      alert("Failed to save scenario");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mt-4">
  <span className="font-semibold">Adjust variable for expected profit:</span>
  <select
    value={scenario.adjustFor}
    onChange={(e) => setScenario(prev => ({ ...prev, adjustFor: e.target.value }))}
    className="border p-2 rounded"
  >
    <option value="units_sold">Units Sold</option>
    <option value="new_price">Selling Price</option>
    <option value="variable_cost">Variable Cost</option>
  </select>
</div>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <WhatIfChart scenario={scenario} onDrag={handleLiveUpdate} />

        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <WhatIfForm scenario={scenario} onChange={handleLiveUpdate} />
        </div>
      </div>

      {!saved && (
        <button
          className="mt-6 w-full bg-blue-600 py-3 rounded-lg text-white font-semibold hover:bg-blue-700"
          onClick={handleSave}
        >
          Save Scenario
        </button>
      )}
    </div>
  );
};

export default WhatIfPage;
