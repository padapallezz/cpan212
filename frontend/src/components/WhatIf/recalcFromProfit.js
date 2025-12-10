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
