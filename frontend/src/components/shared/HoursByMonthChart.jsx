import React, { useEffect, useRef } from "react";
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const HoursByMonthChart = ({ requests }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const months = [
    "Ene","Feb","Mar","Abr","May","Jun",
    "Jul","Ago","Sep","Oct","Nov","Dic"
  ];

  const hoursByMonth = Array(12).fill(0);

  requests.forEach((req) => {
    if (!req.created_at || !req.duration_hours) return;
    const date = new Date(req.created_at);
    const monthIndex = date.getMonth();
    hoursByMonth[monthIndex] += parseFloat(req.duration_hours) || 0;
  });

  useEffect(() => {
    if (chartInstance.current) chartInstance.current.destroy();

    const ctx = chartRef.current.getContext("2d");

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: months,
        datasets: [
          {
            label: "Horas",
            data: hoursByMonth,
            backgroundColor: "#00B5C8",  // Apple blue soft
            borderRadius: 8,
            barThickness: 18,                       // Barras finas estilo iOS
          },
        ],
      },
      options: {
        responsive: true,
        animation: {
          duration: 900,
          easing: "easeOutQuart",   // Estilo Apple fluido
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#1c1c1e", // Estilo dark Apple
            titleColor: "#ffffff",
            bodyColor: "#ffffff",
            cornerRadius: 10,
            padding: 12,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: "rgba(0,0,0,0.05)", // Muy suave
              drawBorder: false,
            },
            ticks: {
              color: "#8e8e93", // Gris Apple
              font: { size: 12 },
            },
          },
          x: {
            grid: { display: false },
            ticks: {
              color: "#8e8e93",
              font: { size: 13 },
            },
          },
        },
      },
    });
  }, [requests]);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "900px",
        borderRadius: "20px",
        backgroundColor: "#ffffffff",
        padding: "25px",
        boxShadow: "var(--box-shadow)",
        margin: "0 auto",
      }}
    >
      <canvas ref={chartRef} height="100"></canvas>
    </div>
  );
};

export default HoursByMonthChart;
