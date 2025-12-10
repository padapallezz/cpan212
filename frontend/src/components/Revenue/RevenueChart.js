import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const RevenueChart = ({ revenues }) => {
  // Group theo month/year
  const monthly = {};
  revenues.forEach((r) => {
    const key = `${r.month}/${r.year}`;
    if (!monthly[key]) monthly[key] = { revenue: 0, profit: 0 };
    monthly[key].revenue += r.revenue;
    monthly[key].profit += r.profit;
  });

  // Sort theo thời gian
  const labels = Object.keys(monthly).sort((a, b) => {
    const [m1, y1] = a.split("/").map(Number);
    const [m2, y2] = b.split("/").map(Number);
    return y1 - y2 || m1 - m2;
  });

  const data = {
    labels,
    datasets: [
      {
        label: "Revenue",
        data: labels.map((l) => monthly[l].revenue),
        backgroundColor: "rgba(54, 162, 235, 0.7)",
      },
      {
        label: "Profit",
        data: labels.map((l) => monthly[l].profit),
        backgroundColor: "rgba(75, 192, 192, 0.7)",
      },
    ],
  };

  return <Bar data={data} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />;
};


export default RevenueChart;
