// src/components/Chart.jsx
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
import { Doughnut, Bar, Line } from "react-chartjs-2";

// Registrar los elementos globalmente
ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

/**
 * Componente reutilizable para mostrar distintos tipos de gráficos con Chart.js
 * @param {string} type - Tipo de gráfico ("doughnut" | "bar" | "line")
 * @param {object} data - Datos del gráfico
 * @param {object} options - Opciones de configuración de Chart.js
 * @param {string | number} width - Ancho del gráfico
 * @param {string | number} height - Alto del gráfico
 */
const Chart = ({ type = "doughnut", data, options, width = "300px", height = "300px" }) => {
  const chartTypes = {
    doughnut: Doughnut,
    bar: Bar,
    line: Line,
  };

  const SelectedChart = chartTypes[type.toLowerCase()] || Doughnut;

  return (
    <div style={{ width, height, margin: "0 auto" }}>
      <SelectedChart data={data} options={options} />
    </div>
  );
};

export default Chart;
