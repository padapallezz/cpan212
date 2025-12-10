import React from "react";
import { useNavigate } from "react-router-dom";

const RevenueTable = ({ revenues }) => {
  const navigate = useNavigate();

  // Group records BY month/year
  const grouped = revenues.reduce((acc, r) => {
    const key = `${r.month}-${r.year}`;
    if (!acc[key]) {
      acc[key] = {
        month: r.month,
        year: r.year,
        totalInvoices: 0,
        totalRevenue: 0,
        totalProfit: 0,
      };
    }

    acc[key].totalInvoices += 1;
    acc[key].totalRevenue += r.revenue;
    acc[key].totalProfit += r.profit;

    return acc;
  }, {});

  const rows = Object.values(grouped);

  return (
    <table className="w-full border-collapse mt-6">
      <thead>
        <tr className="bg-gray-100">
          {["Month", "Year", "Invoices", "Revenue", "Profit"].map((h) => (
            <th key={h} className="border px-3 py-2 text-center font-semibold">
              {h}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {rows.map((r, idx) => (
          <tr
            key={idx}
            className="text-center cursor-pointer hover:bg-blue-50 transition"
            onClick={() => navigate(`/revenue/${r.year}/${r.month}`)}
          >
            <td className="border px-3 py-2">{r.month}</td>
            <td className="border px-3 py-2">{r.year}</td>
            <td className="border px-3 py-2">{r.totalInvoices}</td>
            <td className="border px-3 py-2">${r.totalRevenue.toFixed(2)}</td>
            <td className="border px-3 py-2 font-semibold text-green-600">
              ${r.totalProfit.toFixed(2)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RevenueTable;
