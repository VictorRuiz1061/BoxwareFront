import React from "react";
// Importaciones optimizadas - solo cargar lo que se necesita
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from "chart.js";
import { Line, Bar, Pie, Doughnut } from "react-chartjs-2";

// Registrar solo los componentes que realmente se usan
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

type ChartType = "line" | "bar" | "pie" | "doughnut";

interface GraficaProps {
  type: ChartType;
  data: any; // Datos para el gráfico
  options?: any; // Opciones de configuración del gráfico
}

const Grafica: React.FC<GraficaProps> = ({ type, data, options }) => {
  // Renderizar solo el componente de gráfico necesario
  const renderChart = () => {
    switch (type) {
      case "line":
        return <Line data={data} options={options} />;
      case "bar":
        return <Bar data={data} options={options} />;
      case "pie":
        return <Pie data={data} options={options} />;
      case "doughnut":
        return <Doughnut data={data} options={options} />;
      default:
        return <Line data={data} options={options} />;
    }
  };

  return (
    <div className="w-full h-full">
      {renderChart()}
    </div>
  );
};

export default Grafica;
