import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaDownload, FaSearch, FaChartBar, FaChartPie } from 'react-icons/fa';
import { getEstadoInventario } from '../../../api/informes.api';
import { CSVLink } from 'react-csv';
import Icon from '../../atomos/Icon';
import Grafica from '../../organismos/Grafica';
import Pdf from '../../organismos/Pdf';
import InformesNavigation from '../../organismos/InformesNavigation';

interface EstadoInventarioItem {
  categoria: string;
  cantidad: number;
  stock_total: number;
}

const EstadoInventario: React.FC = () => {
  const [inventario, setInventario] = useState<EstadoInventarioItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getEstadoInventario();
        setInventario(data);
        setError(null);
      } catch (err) {
        setError('Error al cargar los datos. Por favor, intente de nuevo más tarde.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtrar inventario según el término de búsqueda
  const filteredInventario = inventario.filter((item) => {
    const searchString = searchTerm.toLowerCase();
    return item.categoria.toLowerCase().includes(searchString);
  });

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredInventario.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredInventario.length / itemsPerPage);

  // Cambiar de página
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Preparar datos para exportar a CSV
  const csvData = [
    ['Categoría', 'Cantidad de Materiales', 'Stock Total'],
    ...filteredInventario.map((item) => [
      item.categoria,
      item.cantidad,
      item.stock_total
    ])
  ];

  // Calcular el máximo stock para mostrar un porcentaje relativo
  const maxStock = inventario.length > 0 
    ? Math.max(...inventario.map(item => item.stock_total)) 
    : 0;

  const maxCantidad = inventario.length > 0 
    ? Math.max(...inventario.map(item => item.cantidad)) 
    : 0;

  // Preparar datos para la gráfica circular por cantidad de materiales
  const chartDataCantidad = {
    labels: filteredInventario.map(item => item.categoria),
    datasets: [
      {
        label: 'Cantidad de Materiales',
        data: filteredInventario.map(item => item.cantidad),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(199, 199, 199, 0.6)',
          'rgba(83, 102, 255, 0.6)',
          'rgba(78, 205, 196, 0.6)',
          'rgba(232, 65, 24, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(199, 199, 199, 1)',
          'rgba(83, 102, 255, 1)',
          'rgba(78, 205, 196, 1)',
          'rgba(232, 65, 24, 1)',
        ],
        borderWidth: 1
      }
    ]
  };

  // Preparar datos para la gráfica de barras por stock total
  const chartDataStock = {
    labels: currentItems.map(item => item.categoria),
    datasets: [
      {
        label: 'Stock Total',
        data: currentItems.map(item => item.stock_total),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Link to="/informes" className="mr-4">
            <Icon icon={FaArrowLeft} className="text-gray-600 hover:text-gray-800" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Estado General del Inventario</h1>
        </div>
        <div className="flex items-center space-x-2">
          <CSVLink
            data={csvData}
            filename="estado_inventario.csv"
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded flex items-center"
          >
            <Icon icon={FaDownload} className="mr-2" /> Exportar CSV
          </CSVLink>
          <div className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
            <Pdf 
              title="Estado General del Inventario"
              subtitle={`Reporte generado el ${new Date().toLocaleDateString()}`}
              data={filteredInventario.map(item => ({
                Categoría: item.categoria,
                'Cantidad de Materiales': item.cantidad,
                'Stock Total': item.stock_total
              }))}
              fileName="estado_inventario.pdf"
            />
          </div>
        </div>
      </div>

      {/* Navegación entre informes */}
      <InformesNavigation />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Gráfica circular por cantidad de materiales */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Icon icon={FaChartPie} className="mr-2 text-teal-500" /> Distribución de Materiales por Categoría
          </h2>
          <div className="h-64">
            <Grafica 
              type="bar"
              data={chartDataCantidad}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Cantidad de Materiales'
                    }
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Gráfica de barras por stock total */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Icon icon={FaChartBar} className="mr-2 text-teal-500" /> Stock Total por Categoría
          </h2>
          <div className="h-64">
            <Grafica 
              type="bar"
              data={chartDataStock}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Stock Total'
                    }
                  },
                  x: {
                    title: {
                      display: true,
                      text: 'Categorías'
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center mb-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Buscar por categoría..."
              className="w-full py-2 px-4 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Icon icon={FaSearch} size={16} className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>

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
                    <th className="py-3 px-6 text-left">Categoría</th>
                    <th className="py-3 px-6 text-center">Cantidad de Materiales</th>
                    <th className="py-3 px-6 text-center">Stock Total</th>
                    <th className="py-3 px-6 text-left">Distribución Cantidad</th>
                    <th className="py-3 px-6 text-left">Distribución Stock</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm">
                  {currentItems.length > 0 ? (
                    currentItems.map((item, index) => {
                      // Calcular el porcentaje relativo al item con más stock y cantidad
                      const porcentajeStock = (item.stock_total / maxStock) * 100;
                      const porcentajeCantidad = (item.cantidad / maxCantidad) * 100;
                      
                      return (
                        <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="py-3 px-6 text-left">
                            <div className="flex items-center">
                              <div className="mr-2 bg-teal-100 p-2 rounded-full">
                                <Icon icon={FaChartBar} size={16} className="text-teal-500" />
                              </div>
                              {item.categoria}
                            </div>
                          </td>
                          <td className="py-3 px-6 text-center">
                            <span className="bg-teal-100 text-teal-800 py-1 px-3 rounded-full text-xs">
                              {item.cantidad}
                            </span>
                          </td>
                          <td className="py-3 px-6 text-center">{item.stock_total}</td>
                          <td className="py-3 px-6 text-left">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div 
                                className="bg-blue-600 h-2.5 rounded-full" 
                                style={{ width: `${porcentajeCantidad}%` }}
                              ></div>
                            </div>
                          </td>
                          <td className="py-3 px-6 text-left">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div 
                                className="bg-teal-600 h-2.5 rounded-full" 
                                style={{ width: `${porcentajeStock}%` }}
                              ></div>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-4 px-6 text-center text-gray-500">
                        No se encontraron datos que coincidan con la búsqueda.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            {filteredInventario.length > itemsPerPage && (
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

export default React.memo(EstadoInventario);
