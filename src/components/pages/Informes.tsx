import { useState } from "react";

import {
  MaterialesPorUsuarioReport,
  MovimientosHistoricosReport,
  MaterialesStockMinimoReport,
  MaterialesMasUtilizadosReport,
  UsuariosConMasMaterialesReport,
  EstadoInventarioReport,
  MaterialesBajaReport,
} from "@/components/organismos/informes";


const reportOptions = [
    { value: "materiales-por-usuario", label: "Materiales Asignados por Usuario" },
    { value: "movimientos-historicos", label: "Movimientos Históricos" },
    { value: "materiales-stock-minimo", label: "Materiales con Stock Mínimo" },
    { value: "materiales-mas-utilizados", label: "Materiales Más Utilizados" },
    { value: "usuarios-con-mas-materiales", label: "Usuarios con Más Materiales Asignados" },
    { value: "estado-inventario", label: "Estado General del Inventario" },
    { value: "materiales-baja", label: "Materiales Dados de Baja" },
];

const InformesPage = () => {
    const [selectedReport, setSelectedReport] = useState(reportOptions[0].value);

    // Hooks for each report
    
    
    
    
    
    


    const renderReport = () => {
        switch (selectedReport) {
            case "materiales-por-usuario":
                return <MaterialesPorUsuarioReport />;
            case "movimientos-historicos":
                return <MovimientosHistoricosReport />;
            case "materiales-stock-minimo":
                return <MaterialesStockMinimoReport />;
            case "materiales-mas-utilizados":
                return <MaterialesMasUtilizadosReport />;
            case "usuarios-con-mas-materiales":
                return <UsuariosConMasMaterialesReport />;
            case "estado-inventario":
                return <EstadoInventarioReport />;
            case "materiales-baja":
                return <MaterialesBajaReport />; 
            default:
                return <p>Seleccione un informe</p>;
        }
    };

    return (
        <div>
            <div className="p-4 sm:p-6 lg:p-8">
                <label htmlFor="report-select" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Seleccionar Informe
                </label>
                <select
                    id="report-select"
                    value={selectedReport}
                    onChange={(e) => setSelectedReport(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                >
                    {reportOptions.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
            {renderReport()}
        </div>
    );
};

export default InformesPage;