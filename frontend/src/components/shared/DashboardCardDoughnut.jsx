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
        borderRadius: "20px",
        padding: "5px",
        width: "auto",
        height: "100%",
        textAlign: "center",
        boxShadow: "var(--box-shadow)",
      }}
    >
      <h3 style={{ fontWeight: "bold", display: 'flex', justifyContent: 'center' }}>Horas acumuladas</h3>
      <div
        style={{
          display: "flex",
          // flexDirection: "column",
          justifyContent: 'center',
          alignItems: 'center',
          alignItems: "center",
          height: "80%",
          // gap: "20px",
        }}
      >
        {/* <Doughnut data={donutData} options={donutOptions} /> */}
        <div
          style={{
            // height: '100%',
            fontWeight: "bold",
            fontSize: "2rem",
            color: "#2D3748",
          }}
        >
          {totalHoras}
        </div>
{/* 
        <div>
          <p style={{ fontWeight: "600", fontSize: "14px" }}>Horas por mes</p>
          <div style={{ height: "60px", width: "100%" }}>
            <Bar data={barData} options={barOptions} />
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default DashboardCard;
