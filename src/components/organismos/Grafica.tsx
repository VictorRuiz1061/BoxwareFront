import React from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
import { Line, Bar, Pie, Doughnut } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

type ChartType = "line" | "bar" | "pie" | "doughnut";

interface GraficaProps {
  type: ChartType;
  data: any; // Datos para el gráfico
  options?: any; // Opciones de configuración del gráfico
}

const Grafica: React.FC<GraficaProps> = ({ type, data, options }) => {
  return (
    <div className="w-full h-full">
      {type === "line" && <Line data={data} options={options} />}
      {type === "bar" && <Bar data={data} options={options} />}
      {type === "pie" && <Pie data={data} options={options} />}
      {type === "doughnut" && <Doughnut data={data} options={options} />}
    </div>
  );
};

export default Grafica;
