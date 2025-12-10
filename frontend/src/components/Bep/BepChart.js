import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  ReferenceDot,
  Area,
} from "recharts";

const BepChart = ({ bep }) => {
  if (!bep) return null;

  const generateChartData = (bep) => {
    const data = [];
    const maxUnits = bep.bep_unit * 2;
    const step = Math.ceil(maxUnits / 50);
    for (let x = 0; x <= maxUnits; x += step) {
      const totalCost = bep.fixed_cost + bep.variable_cost_per_unit * x;
      const revenue = bep.selling_price_per_unit * x;
      const profit = revenue - totalCost;
      data.push({ units: x, totalCost, revenue, profit });
    }
    return data;
  };

  const chartData = generateChartData(bep);

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 lg:w-2/3">
      <h2 className="text-xl font-semibold mb-4 text-blue-600">
        Product: {bep.product_name}
      </h2>
      <div style={{ width: "100%", height: 400 }}>
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="units"
              label={{ value: "Units Sold", position: "insideBottom", offset: -5 }}
            />
            <YAxis label={{ value: "Amount ($)", angle: -90, position: "insideLeft" }} />
            <Tooltip formatter={(value, name) => [`$${value}`, name]} />
            <Legend verticalAlign="top" height={36} />
            <Area type="monotone" dataKey="profit" stroke={false} fill="red" fillOpacity={0.2} isAnimationActive={false} />
            <Line type="monotone" dataKey="totalCost" stroke="#f87171" name="Total Cost" strokeWidth={2} />
            <Line type="monotone" dataKey="revenue" stroke="#34d399" name="Revenue" strokeWidth={2} />
            <ReferenceDot
              x={bep.bep_unit}
              y={bep.selling_price_per_unit * bep.bep_unit}
              r={6}
              fill="blue"
              stroke="blue"
              label={{ position: "top", value: "BEP", fill: "blue" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 bg-gray-50 p-4 rounded">
        <p>
          To break even, <strong>{bep.product_name}</strong> must sell approximately{" "}
          <strong>{Math.round(bep.bep_unit)}</strong> units.
        </p>
        <p className="text-sm text-gray-500 mt-2">Red area = loss, Green area = profit (visual approximation)</p>
      </div>
    </div>
  );
};

export default BepChart;
