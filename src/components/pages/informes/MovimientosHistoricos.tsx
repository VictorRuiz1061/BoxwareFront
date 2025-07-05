import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaDownload, FaSearch, FaCalendarAlt } from 'react-icons/fa';
import { getMovimientosHistoricos } from '../../../api/informes.api';
import { CSVLink } from 'react-csv';
import Icon from '../../atomos/Icon';
import InformesNavigation from '../../organismos/InformesNavigation';

interface Movimiento {
  id_movimiento: number;
  nombre_material: string;
  codigo_sena: string;
  nombre_usuario: string;
  apellido_usuario: string;
  tipo_movimiento: string;
  fecha_creacion: string;
  ubicacion: string;
}

const MovimientosHistoricos: React.FC = () => {
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);
  const [fechaInicio, setFechaInicio] = useState<string>('');
  const [fechaFin, setFechaFin] = useState<string>('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getMovimientosHistoricos(fechaInicio, fechaFin);
      setMovimientos(data);
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

  const handleLimpiarFiltros = () => {
    setFechaInicio('');
    setFechaFin('');
    fetchData();
  };

  // Filtrar movimientos según el término de búsqueda
  const filteredMovimientos = movimientos.filter((movimiento) => {
    const searchString = searchTerm.toLowerCase();
    return (
      movimiento.nombre_material.toLowerCase().includes(searchString) ||
      movimiento.codigo_sena.toLowerCase().includes(searchString) ||
      movimiento.nombre_usuario.toLowerCase().includes(searchString) ||
      movimiento.apellido_usuario.toLowerCase().includes(searchString) ||
      movimiento.tipo_movimiento.toLowerCase().includes(searchString) ||
      movimiento.ubicacion.toLowerCase().includes(searchString)
    );
  });

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredMovimientos.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredMovimientos.length / itemsPerPage);

  // Cambiar de página
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Preparar datos para exportar a CSV
  const csvData = [
    ['ID', 'Material', 'Código SENA', 'Usuario', 'Tipo Movimiento', 'Fecha', 'Ubicación'],
    ...filteredMovimientos.map((movimiento) => [
      movimiento.id_movimiento,
      movimiento.nombre_material,
      movimiento.codigo_sena,
      `${movimiento.nombre_usuario} ${movimiento.apellido_usuario}`,
      movimiento.tipo_movimiento,
      new Date(movimiento.fecha_creacion).toLocaleString(),
      movimiento.ubicacion
    ])
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Link to="/informes" className="mr-4">
            <Icon icon={FaArrowLeft} className="text-gray-600 hover:text-gray-800" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Movimientos Históricos de Materiales</h1>
        </div>
        <div className="flex items-center">
          <CSVLink
            data={csvData}
            filename="movimientos_historicos.csv"
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded flex items-center mr-2"
          >
            <Icon icon={FaDownload} className="mr-2" /> Exportar CSV
          </CSVLink>
        </div>
      </div>

      {/* Navegación entre informes */}
      <InformesNavigation />

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        {/* Filtros de fecha */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon icon={FaCalendarAlt} size={16} className="text-gray-400" />
              </div>
              <input
                type="date"
                className="pl-10 w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </div>
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon icon={FaCalendarAlt} size={16} className="text-gray-400" />
              </div>
              <input
                type="date"
                className="pl-10 w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
              />
            </div>
          </div>
          <div className="col-span-1 flex items-end">
            <button
              onClick={handleFiltrar}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            >
              Filtrar
            </button>
          </div>
          <div className="col-span-1 flex items-end">
            <button
              onClick={handleLimpiarFiltros}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded"
            >
              Limpiar Filtros
            </button>
          </div>
        </div>

        <div className="flex items-center mb-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Buscar por material, usuario, tipo de movimiento..."
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
                    <th className="py-3 px-6 text-left">Material</th>
                    <th className="py-3 px-6 text-left">Código SENA</th>
                    <th className="py-3 px-6 text-left">Usuario</th>
                    <th className="py-3 px-6 text-left">Tipo Movimiento</th>
                    <th className="py-3 px-6 text-left">Fecha</th>
                    <th className="py-3 px-6 text-left">Ubicación</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm">
                  {currentItems.length > 0 ? (
                    currentItems.map((movimiento) => (
                      <tr key={movimiento.id_movimiento} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-6 text-left">{movimiento.nombre_material}</td>
                        <td className="py-3 px-6 text-left">{movimiento.codigo_sena}</td>
                        <td className="py-3 px-6 text-left">{`${movimiento.nombre_usuario} ${movimiento.apellido_usuario}`}</td>
                        <td className="py-3 px-6 text-left">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            movimiento.tipo_movimiento.includes('Entrada') ? 'bg-green-100 text-green-800' :
                            movimiento.tipo_movimiento.includes('Salida') ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {movimiento.tipo_movimiento}
                          </span>
                        </td>
                        <td className="py-3 px-6 text-left">{new Date(movimiento.fecha_creacion).toLocaleString()}</td>
                        <td className="py-3 px-6 text-left">{movimiento.ubicacion}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-4 px-6 text-center text-gray-500">
                        No se encontraron movimientos que coincidan con la búsqueda.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            {filteredMovimientos.length > itemsPerPage && (
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

export default React.memo(MovimientosHistoricos);
