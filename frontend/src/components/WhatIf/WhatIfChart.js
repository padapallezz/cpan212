import dragData from 'chartjs-plugin-dragdata';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  ChartDataLabels,
  dragData
);

const WhatIfChart = ({ scenario, onDrag }) => {
  const chartData = {
    datasets: [
      {
        label: "Units Sold vs Price",
        data: [{ x: scenario.new_price, y: scenario.units_sold }],
        backgroundColor: "rgba(54,162,235,0.6)",
        pointRadius: 10,
      },
    ],
  };

  const options = {
    plugins: {
      dragData: {
        round: 1,
        dragX: true,
        dragY: true,
        onDragEnd: (e, datasetIndex, index, value) => {
          // value.x = new_price, value.y = units_sold
          onDrag({ new_price: value.x, units_sold: value.y });
        },
      },
    },
    scales: {
      x: { title: { display: true, text: "Price / Unit" } },
      y: { title: { display: true, text: "Units Sold" } },
    },
  };

  return <Scatter data={chartData} options={options} />;
};
export default WhatIfChart;
