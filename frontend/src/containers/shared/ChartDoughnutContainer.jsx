import Chart from "../../components/shared/Chart";

const data = {
  labels: ["Enero", "Febrero", "Marzo", "Abril"],
  datasets: [
    {
      label: "Horas acumuladas",
      data: [10, 20, 15, 30],
      backgroundColor: ["#00B8B8", "#4FD1C5", "#81E6D9", "#B2F5EA"],
    },
  ],
};

const options = {
  plugins: {
    legend: { display: true, position: "bottom" },
  },
};

const ChartDoughnutContainer = () => (
  <Chart type="doughnut" data={data} options={options} width="150px" />
);


export default ChartDoughnutContainer;