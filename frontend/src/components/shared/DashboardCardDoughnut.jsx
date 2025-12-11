// src/components/DashboardCard.jsx
import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const DashboardCard = ({ totalHoras }) => {
  const MAX_HOURS = 96;
  const progreso = Math.min(totalHoras, MAX_HOURS);
  const restante = Math.max(MAX_HOURS - progreso, 0);
  const completado = totalHoras >= MAX_HOURS;

  const donutData = {
    labels: ["Progreso", "Restante"],
    datasets: [
      {
        data: [progreso, restante],
        backgroundColor: ["#00C4A7", "#E5E7EB"],
        borderWidth: 0,
        cutout: "75%",
      },
    ],
  };

  const donutOptions = {
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    cutout: "75%",
  };

  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "20px",
        padding: "15px",
        // width: "100%",
        height: "100%",
        textAlign: "center",
        boxShadow: "var(--box-shadow)",
      }}
    >
      <h3
        style={{
          fontWeight: "bold",
          marginBottom: "10px",
          color: "#1A202C",
        }}
      >
        Horas acumuladas
      </h3>

      <div
        style={{
          position: "relative",
          width: "120px",
          margin: "0 auto",
        }}
      >
        <Doughnut data={donutData} options={donutOptions} />

        {/* Centro de la dona */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: completado ? "1.2rem" : "2rem",
            color: completado ? "#00A389" : "#2D3748",
          }}
        >
          {completado ? "✔" : progreso}
        </div>
      </div>

      {/* Mensaje */}
      <p
        style={{
          marginTop: "10px",
          fontWeight: "600",
          color: completado ? "#00A389" : "#4A5568",
        }}
      >
        {completado ? "Progreso completado" : `${progreso} / ${MAX_HOURS} horas`}
      </p>
    </div>
  );
};

export default DashboardCard;
