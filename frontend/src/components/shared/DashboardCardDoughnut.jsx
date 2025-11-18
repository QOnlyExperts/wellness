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
        padding: "5px",
        width: "auto",
        height: "100%",
        textAlign: "center",
        boxShadow: "var(--box-shadow)",
      }}
    >

      <div style={{ 
        display: "flex", 
          flexDirection: "column", 
          // justifyContent: "space-between", 
          alignItems: "center", 
          height: "100%",
          gap: "20px" 
        }}>
          <h3 style={{ fontWeight: "bold" }}>Horas acumuladas</h3>
          <div style={{ width: "100px", height:"50%", position: "relative" }}>
            {/* <Doughnut data={donutData} options={donutOptions} /> */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                fontWeight: "bold",
                fontSize: "4rem",
                color: "#2D3748",
              }}
            >
              {96}
            </div>
          </div>

        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: "600", fontSize: "14px" }}>Horas por mes</p>
          <div style={{ height: "60px", width: '100%' }}>
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
