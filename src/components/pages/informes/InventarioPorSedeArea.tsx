import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaDownload, FaSearch, FaWarehouse, FaBuilding, FaMapMarkerAlt } from 'react-icons/fa';
import { getInventarioPorSedeArea } from '../../../api/informes.api';
import { CSVLink } from 'react-csv';
import Icon from '../../atomos/Icon';
import InformesNavigation from '../../organismos/InformesNavigation';

interface InventarioItem {
  nombre_centro: string;
  nombre_sede: string;
  nombre_area: string;
  cantidad_materiales: number;
  stock_total: number;
}

const InventarioPorSedeArea: React.FC = () => {
  const [inventario, setInventario] = useState<InventarioItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getInventarioPorSedeArea();
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
    return (
      item.nombre_centro.toLowerCase().includes(searchString) ||
      item.nombre_sede.toLowerCase().includes(searchString) ||
      item.nombre_area.toLowerCase().includes(searchString)
    );
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
    ['Centro', 'Sede', 'Área', 'Cantidad de Materiales', 'Stock Total'],
    ...filteredInventario.map((item) => [
      item.nombre_centro,
      item.nombre_sede,
      item.nombre_area,
      item.cantidad_materiales,
      item.stock_total
    ])
  ];

  // Calcular totales para mostrar en el resumen
  const totalMateriales = filteredInventario.reduce((sum, item) => sum + Number(item.cantidad_materiales), 0);
  const totalStock = filteredInventario.reduce((sum, item) => sum + Number(item.stock_total), 0);
  const totalCentros = new Set(filteredInventario.map(item => item.nombre_centro)).size;
  const totalSedes = new Set(filteredInventario.map(item => item.nombre_sede)).size;
  const totalAreas = new Set(filteredInventario.map(item => item.nombre_area)).size;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Link to="/informes" className="mr-4">
            <Icon icon={FaArrowLeft} className="text-gray-600 hover:text-gray-800" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Inventario por Sede y Área</h1>
        </div>
        <div className="flex items-center">
          <CSVLink
            data={csvData}
            filename="inventario_por_sede_area.csv"
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded flex items-center mr-2"
          >
            <Icon icon={FaDownload} className="mr-2" /> Exportar CSV
          </CSVLink>
        </div>
      </div>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4 flex items-center">
          <div className="rounded-full bg-blue-100 p-3 mr-4">
            <Icon icon={FaBuilding} size={20} className="text-blue-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Centros</p>
            <p className="text-xl font-semibold">{totalCentros}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 flex items-center">
          <div className="rounded-full bg-green-100 p-3 mr-4">
            <Icon icon={FaWarehouse} size={20} className="text-green-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Sedes</p>
            <p className="text-xl font-semibold">{totalSedes}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 flex items-center">
          <div className="rounded-full bg-purple-100 p-3 mr-4">
            <Icon icon={FaMapMarkerAlt} size={20} className="text-purple-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Áreas</p>
            <p className="text-xl font-semibold">{totalAreas}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 flex items-center">
          <div className="rounded-full bg-yellow-100 p-3 mr-4">
            <Icon icon={FaWarehouse} size={20} className="text-yellow-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Materiales</p>
            <p className="text-xl font-semibold">{totalMateriales}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 flex items-center">
          <div className="rounded-full bg-red-100 p-3 mr-4">
            <Icon icon={FaWarehouse} size={20} className="text-red-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Stock Total</p>
            <p className="text-xl font-semibold">{totalStock}</p>
          </div>
        </div>
      </div>

      {/* Navegación entre informes */}
      <InformesNavigation />

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center mb-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Buscar por centro, sede o área..."
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
                    <th className="py-3 px-6 text-left">Centro</th>
                    <th className="py-3 px-6 text-left">Sede</th>
                    <th className="py-3 px-6 text-left">Área</th>
                    <th className="py-3 px-6 text-center">Cantidad de Materiales</th>
                    <th className="py-3 px-6 text-center">Stock Total</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm">
                  {currentItems.length > 0 ? (
                    currentItems.map((item, index) => (
                      <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-6 text-left">{item.nombre_centro}</td>
                        <td className="py-3 px-6 text-left">{item.nombre_sede}</td>
                        <td className="py-3 px-6 text-left">{item.nombre_area}</td>
                        <td className="py-3 px-6 text-center">
                          <span className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-xs">
                            {item.cantidad_materiales}
                          </span>
                        </td>
                        <td className="py-3 px-6 text-center">
                          <span className="bg-green-100 text-green-800 py-1 px-3 rounded-full text-xs">
                            {item.stock_total}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-4 px-6 text-center text-gray-500">
                        No se encontraron resultados que coincidan con la búsqueda.
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

export default React.memo(InventarioPorSedeArea);
