"use client";

import "chart.js/auto";
import { Line } from "react-chartjs-2";

interface PriceData {
  date: string;
  id: number;
  price: string;
  product_id: number;
}

export default function Chart({ priceData }: { priceData: PriceData[]; }) {
  const chartData = {
    labels: priceData.map((data) => {
      const date = new Date(data.date);
      const day = date.getDate().toString().padStart(2, '0'); 
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    }),
    datasets: [
      {
        label: 'Price',
        data: priceData.map((data) => parseFloat(data.price).toFixed(2)),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="w-full">
      <h2>Price Action (Weekly)</h2>
      <Line data={chartData} />
    </div>
  );
}


