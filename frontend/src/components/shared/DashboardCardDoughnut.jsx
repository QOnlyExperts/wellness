// src/components/DashboardCard.jsx
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

const DashboardCard = ({ totalHoras, horasPorMes }) => {
  // Donut
  const donutData = {
    labels: ["Horas utilizadas", "Restante"],
    datasets: [
      {
        data: [totalHoras, 100 - totalHoras],
        backgroundColor: ["#00B8B8", "#E2E8F0"],
        cutout: "80%",
        borderWidth: 0,
      },
    ],
  };

  const donutOptions = {
    cutout: "75%",
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
  };

  // Barras
  const barData = {
    labels: horasPorMes.map((m) => m.mes),
    datasets: [
      {
        data: horasPorMes.map((m) => m.horas),
        backgroundColor: "#4FD1C5",
        borderRadius: 5,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    scales: {
      x: { display: false },
      y: { display: false },
    },
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
  };

  return (
    <div
      style={{
        // background: "linear-gradient(135deg, #E6FFFA, #B2F5EA)",
        background: "#ffffff",
        borderRadius: "10px",
        padding: "10px",
        width: "300px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      }}
    >
      <h3 style={{ marginBottom: "10px", fontWeight: "bold" }}>Dashboard</h3>

      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <div style={{ width: "100px", position: "relative" }}>
          <Doughnut data={donutData} options={donutOptions} />
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontWeight: "bold",
              fontSize: "18px",
              color: "#2D3748",
            }}
          >
            {totalHoras}H
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: "600", fontSize: "14px" }}>Horas por mes</p>
          <div style={{ height: "60px" }}>
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
