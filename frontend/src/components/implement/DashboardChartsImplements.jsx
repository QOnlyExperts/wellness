// src/components/DashboardCharts.jsx
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
import { translateStatus } from "../../utils/formatStatus";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const DashboardChartsImplements  = ({ implementCategory, distributionStatus }) => {
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

  // === Gráfica donut: Distribución por estado ===
  const donutData = {
    labels: distributionStatus.map((item) => item.status),
    datasets: [
      {
        data: distributionStatus.map((item) => item.amount  ),
        backgroundColor: distributionStatus.map(
          (item) => getComputedStyle(document.documentElement)
            .getPropertyValue(`--color-${item.status}`)
            .trim()
        ),
        borderWidth: 0,
        cutout: "75%",
      },
    ],
  };

  const donutOptions = {
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: { usePointStyle: true, boxWidth: 10 },
      },
      tooltip: {
        enabled: true,
        backgroundColor: "#1A202C",
        titleColor: "#fff",
        bodyColor: "#fff",
        displayColors: false,
        callbacks: {
          label: function (ctx) {
            return `${translateStatus(ctx.label)}: ${ctx.formattedValue} implementos`;
          },
        },
      }
    },
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", padding: "10px", gap: "20px", width: "300px", height: '100%' }}>
      {/* Gráfica de barras */}
      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          padding: "15px",
          boxShadow: "var(--box-shadow)",
        }}
      >
        <h4 style={{ fontWeight: "600", fontSize: "14px", marginBottom: "10px" }}>
          Implementos por grupos
        </h4>
        <Bar data={barData} options={barOptions} />
      </div>

      {/* Gráfica donut */}
      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          padding: "15px",
          boxShadow: "var(--box-shadow)",
        }}
      >
        <h4 style={{ fontWeight: "600", fontSize: "14px", marginBottom: "10px" }}>
          Distribución por estado
        </h4>
        <Doughnut data={donutData} options={donutOptions} />
      </div>
    </div>
  );
};

export default DashboardChartsImplements ;
