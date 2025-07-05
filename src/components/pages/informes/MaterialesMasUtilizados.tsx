import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaDownload, FaSearch, FaChartLine, FaChartBar } from 'react-icons/fa';
import { getMaterialesMasUtilizados } from '../../../api/informes.api';
import { CSVLink } from 'react-csv';
import Icon from '../../atomos/Icon';
import InformesNavigation from '../../organismos/InformesNavigation';
import Grafica from '../../organismos/Grafica';
import Pdf from '../../organismos/Pdf';

interface Material {
  id_material: number;
  nombre_material: string;
  codigo_sena: string;
  total_movimientos: number;
}

const MaterialesMasUtilizados: React.FC = () => {
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);
  const [limite, setLimite] = useState<number>(10);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getMaterialesMasUtilizados(limite);
      setMateriales(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los datos. Por favor, intente de nuevo más tarde.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFiltrar = () => {
    fetchData();
  };

  // Filtrar materiales según el término de búsqueda
  const filteredMateriales = materiales.filter((material) => {
    const searchString = searchTerm.toLowerCase();
    return (
      material.nombre_material.toLowerCase().includes(searchString) ||
      material.codigo_sena.toLowerCase().includes(searchString)
    );
  });

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredMateriales.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredMateriales.length / itemsPerPage);

  // Cambiar de página
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Preparar datos para exportar a CSV
  const csvData = [
    ['ID', 'Nombre Material', 'Código SENA', 'Total Movimientos'],
    ...filteredMateriales.map((material) => [
      material.id_material,
      material.nombre_material,
      material.codigo_sena,
      material.total_movimientos
    ])
  ];

  // Calcular el material con más movimientos para mostrar un porcentaje relativo
  const maxMovimientos = materiales.length > 0 
    ? Math.max(...materiales.map(m => m.total_movimientos)) 
    : 0;

  // Preparar datos para la gráfica
  const chartData = {
    labels: currentItems.map(material => material.nombre_material),
    datasets: [
      {
        label: 'Total Movimientos',
        data: currentItems.map(material => material.total_movimientos),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Cantidad de Movimientos'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Materiales'
        }
      }
    },
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Link to="/informes" className="mr-4">
            <Icon icon={FaArrowLeft} className="text-gray-600 hover:text-gray-800" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Materiales Más Utilizados</h1>
        </div>
        <div className="flex items-center space-x-2">
          <CSVLink
            data={csvData}
            filename="materiales_mas_utilizados.csv"
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded flex items-center"
          >
            <Icon icon={FaDownload} className="mr-2" /> Exportar CSV
          </CSVLink>
          <div className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
            <Pdf 
              title="Materiales Más Utilizados"
              subtitle={`Reporte generado el ${new Date().toLocaleDateString()}`}
              data={filteredMateriales.map(material => ({
                ID: material.id_material,
                'Nombre Material': material.nombre_material,
                'Código SENA': material.codigo_sena,
                'Total Movimientos': material.total_movimientos
              }))}
              fileName="materiales_mas_utilizados.pdf"
            />
          </div>
        </div>
      </div>

      {/* Navegación entre informes */}
      <InformesNavigation />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Gráfica */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Icon icon={FaChartBar} className="mr-2 text-teal-500" /> Gráfico de Materiales Más Utilizados
          </h2>
          <div className="h-64">
            <Grafica 
              type="bar"
              data={chartData}
              options={chartOptions}
            />
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Filtros y Configuración</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Límite de Materiales</label>
            <div className="flex items-center">
              <input
                type="number"
                min="5"
                max="50"
                className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={limite}
                onChange={(e) => setLimite(parseInt(e.target.value) || 10)}
              />
              <button
                onClick={handleFiltrar}
                className="ml-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
              >
                Aplicar
              </button>
            </div>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por nombre, código..."
              className="w-full py-2 px-4 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Icon icon={FaSearch} size={16} className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
            <p>{error}</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-left">Código SENA</th>
                    <th className="py-3 px-6 text-left">Nombre Material</th>
                    <th className="py-3 px-6 text-center">Total Movimientos</th>
                    <th className="py-3 px-6 text-left">Distribución</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm">
                  {currentItems.length > 0 ? (
                    currentItems.map((material) => {
                      // Calcular el porcentaje relativo al material con más movimientos
                      const porcentaje = (material.total_movimientos / maxMovimientos) * 100;
                      
                      return (
                        <tr key={material.id_material} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="py-3 px-6 text-left">{material.codigo_sena}</td>
                          <td className="py-3 px-6 text-left">
                            <div className="flex items-center">
                              <div className="mr-2 bg-teal-100 p-2 rounded-full">
                                <Icon icon={FaChartLine} size={16} className="text-teal-500" />
                              </div>
                              {material.nombre_material}
                            </div>
                          </td>
                          <td className="py-3 px-6 text-center">
                            <span className="bg-teal-100 text-teal-800 py-1 px-3 rounded-full text-xs">
                              {material.total_movimientos}
                            </span>
                          </td>
                          <td className="py-3 px-6 text-left">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div 
                                className="bg-teal-600 h-2.5 rounded-full" 
                                style={{ width: `${porcentaje}%` }}
                              ></div>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-4 px-6 text-center text-gray-500">
                        No se encontraron materiales que coincidan con la búsqueda.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            {filteredMateriales.length > itemsPerPage && (
              <div className="flex justify-center mt-6">
                <nav className="flex items-center">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-md mr-2 ${
                      currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Anterior
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`px-3 py-1 rounded-md mx-1 ${
                        currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {number}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-md ml-2 ${
                      currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Siguiente
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default React.memo(MaterialesMasUtilizados);
