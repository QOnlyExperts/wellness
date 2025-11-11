import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";


ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const DashboardChartsGroupImplements = ({ implementCategory}) => {
  // === Gráfica de barras: Implementos por categoría ===
  const barData = {
    labels: implementCategory.map((item) => item.category),
    datasets: [
      {
        label: "Implementos",
        data: implementCategory.map((item) => item.amount),
        backgroundColor: "#00B8B8",
        borderRadius: 8,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: {
        ticks: { color: "#4A5568" },
        grid: { display: false },
      },
      y: {
        ticks: { display: false },
        grid: { display: false },
      },
    },
  };

  return (
    <div className="statistics">
      {/* Gráfica de barras */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100px'
          // background: "#fff",
          // borderRadius: "12px",
          // padding: "15px",
          // boxShadow: "var(--box-shadow)",
        }}
      >
        <h4 style={{ fontWeight: "600", fontSize: "14px", marginBottom: "10px" }}>
          Implementos por grupos
        </h4>
        <Bar data={barData} options={barOptions} />
      </div>
    </div>
  );
};

export default DashboardChartsGroupImplements;