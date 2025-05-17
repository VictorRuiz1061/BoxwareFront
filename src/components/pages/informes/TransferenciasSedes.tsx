import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaDownload, FaSearch, FaExchangeAlt, FaChartBar } from 'react-icons/fa';
import { getTransferenciasSedes } from '../../../api/informes.api';
import { CSVLink } from 'react-csv';
import Icon from '../../atomos/Icon';
import Grafica from '../../organismos/Grafica';
import Pdf from '../../organismos/Pdf';
import InformesNavigation from '../../organismos/InformesNavigation';

interface Transferencia {
  id_movimiento: number;
  material_id: number;
  nombre_material: string;
  codigo_sena: string;
  ubicacion_actual: string;
  area_actual: string;
  sede_actual: string;
  tipo_movimiento: string;
  fecha_creacion: string;
}

const TransferenciasSedes: React.FC = () => {
  const [transferencias, setTransferencias] = useState<Transferencia[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);
  const [selectedSedeOrigen, setSelectedSedeOrigen] = useState<string>('');
  const [selectedSedeDestino, setSelectedSedeDestino] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getTransferenciasSedes();
        setTransferencias(data);
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

  // Filtrar transferencias según el término de búsqueda y sedes seleccionadas
  const filteredTransferencias = transferencias.filter((transferencia) => {
    const searchString = searchTerm.toLowerCase();
    const matchesSearch = (
      (transferencia.nombre_material?.toLowerCase() || '').includes(searchString) ||
      (transferencia.codigo_sena?.toLowerCase() || '').includes(searchString) ||
      (transferencia.sede_actual?.toLowerCase() || '').includes(searchString) ||
      (transferencia.area_actual?.toLowerCase() || '').includes(searchString) ||
      (transferencia.tipo_movimiento?.toLowerCase() || '').includes(searchString)
    );
    
    const matchesSedeOrigen = selectedSedeOrigen ? transferencia.sede_actual === selectedSedeOrigen : true;
    const matchesSedeDestino = selectedSedeDestino ? transferencia.sede_actual === selectedSedeDestino : true;
    
    return matchesSearch && (matchesSedeOrigen || matchesSedeDestino);
  });

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTransferencias.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTransferencias.length / itemsPerPage);

  // Cambiar de página
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Preparar datos para exportar a CSV
  const csvData = [
    ['Código SENA', 'Nombre Material', 'Sede', 'Área', 'Ubicación', 'Tipo Movimiento', 'Fecha'],
    ...filteredTransferencias.map((transferencia) => [
      transferencia.codigo_sena,
      transferencia.nombre_material,
      transferencia.sede_actual,
      transferencia.area_actual,
      transferencia.ubicacion_actual,
      transferencia.tipo_movimiento,
      new Date(transferencia.fecha_creacion).toLocaleString()
    ])
  ];

  // Obtener listas de sedes únicas para los filtros
  const sedesOrigen = Array.from(new Set(transferencias.map(item => item.sede_actual)));
  const sedesDestino = sedesOrigen; // Usamos las mismas sedes ya que ahora solo tenemos sede_actual

  // Preparar datos para la gráfica de transferencias por sede
  const transferenciasPorSede = transferencias.reduce((acc, transferencia) => {
    const sede = transferencia.sede_actual || 'No especificado';
    if (!acc[sede]) {
      acc[sede] = 0;
    }
    acc[sede]++;
    return acc;
  }, {} as Record<string, number>);

  // Preparar datos para la gráfica de transferencias por tipo de movimiento
  const transferenciasPorTipoMovimiento = transferencias.reduce((acc, transferencia) => {
    const tipo = transferencia.tipo_movimiento || 'No especificado';
    if (!acc[tipo]) {
      acc[tipo] = 0;
    }
    acc[tipo]++;
    return acc;
  }, {} as Record<string, number>);

  // Datos para gráfico de barras por sede
  const chartDataBySedeOrigen = {
    labels: Object.keys(transferenciasPorSede),
    datasets: [
      {
        label: 'Transferencias por sede',
        data: Object.values(transferenciasPorSede),
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1
      }
    ]
  };

  // Datos para gráfico de barras por tipo de movimiento
  const chartDataByTipoMovimiento = {
    labels: Object.keys(transferenciasPorTipoMovimiento),
    datasets: [
      {
        label: 'Transferencias por tipo',
        data: Object.values(transferenciasPorTipoMovimiento),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link to="/informes" className="mr-4">
            <Icon icon={FaArrowLeft} className="text-gray-600 hover:text-gray-800" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Transferencias entre Sedes</h1>
        </div>
        <div className="flex items-center space-x-2">
          <CSVLink
            data={csvData}
            filename="transferencias_sedes.csv"
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded flex items-center"
          >
            <Icon icon={FaDownload} className="mr-2" /> Exportar CSV
          </CSVLink>
          <div className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
            <Pdf 
              title="Transferencias entre Sedes"
              subtitle={`Reporte generado el ${new Date().toLocaleDateString()}`}
              data={filteredTransferencias.map(transferencia => ({
                'Código SENA': transferencia.codigo_sena,
                'Material': transferencia.nombre_material,
                'Sede': transferencia.sede_actual,
                'Área': transferencia.area_actual,
                'Ubicación': transferencia.ubicacion_actual,
                'Tipo Movimiento': transferencia.tipo_movimiento,
                'Fecha': new Date(transferencia.fecha_creacion).toLocaleString()
              }))}
              fileName="transferencias_sedes.pdf"
            />
          </div>
        </div>
      </div>

      {/* Navegación entre informes */}
      <InformesNavigation />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Gráfica de transferencias por sede */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Icon icon={FaChartBar} className="mr-2 text-orange-500" /> Transferencias por Sede
          </h2>
          <div className="h-64">
            <Grafica 
              type="bar"
              data={chartDataBySedeOrigen}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Cantidad de Transferencias'
                    }
                  },
                  x: {
                    title: {
                      display: true,
                      text: 'Sedes de Origen'
                    }
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Gráfica de transferencias por tipo de movimiento */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Icon icon={FaChartBar} className="mr-2 text-purple-500" /> Transferencias por Tipo de Movimiento
          </h2>
          <div className="h-64">
            <Grafica 
              type="bar"
              data={chartDataByTipoMovimiento}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Cantidad de Transferencias'
                    }
                  },
                  x: {
                    title: {
                      display: true,
                      text: 'Sedes de Destino'
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Filtrar por Sede Origen</label>
            <select
              className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedSedeOrigen}
              onChange={(e) => setSelectedSedeOrigen(e.target.value)}
            >
              <option value="">Todas las Sedes</option>
              {sedesOrigen.map((sede) => (
                <option key={sede} value={sede}>{sede}</option>
              ))}
            </select>
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Filtrar por Sede Destino</label>
            <select
              className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedSedeDestino}
              onChange={(e) => setSelectedSedeDestino(e.target.value)}
            >
              <option value="">Todas las Sedes</option>
              {sedesDestino.map((sede) => (
                <option key={sede} value={sede}>{sede}</option>
              ))}
            </select>
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por material, sede, área..."
                className="w-full py-2 px-4 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Icon icon={FaSearch} size={16} className="absolute left-3 top-3 text-gray-400" />
            </div>
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
                    <th className="py-3 px-6 text-left">Código SENA</th>
                    <th className="py-3 px-6 text-left">Nombre Material</th>
                    <th className="py-3 px-6 text-left">Sede</th>
                    <th className="py-3 px-6 text-left">Área</th>
                    <th className="py-3 px-6 text-left">Ubicación</th>
                    <th className="py-3 px-6 text-left">Tipo Movimiento</th>
                    <th className="py-3 px-6 text-left">Fecha</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm">
                  {currentItems.length > 0 ? (
                    currentItems.map((transferencia) => (
                      <tr key={transferencia.id_movimiento} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-6 text-left">{transferencia.codigo_sena}</td>
                        <td className="py-3 px-6 text-left">{transferencia.nombre_material}</td>
                        <td className="py-3 px-6 text-left">
                          <div className="flex items-center">
                            <div className="mr-2 bg-orange-100 p-2 rounded-full">
                              <Icon icon={FaExchangeAlt} size={16} className="text-orange-500" />
                            </div>
                            {transferencia.sede_actual}
                          </div>
                        </td>
                        <td className="py-3 px-6 text-left">{transferencia.area_actual}</td>
                        <td className="py-3 px-6 text-left">{transferencia.ubicacion_actual}</td>
                        <td className="py-3 px-6 text-left">
                          <span className="py-1 px-3 rounded-full text-xs bg-purple-100 text-purple-800">
                            {transferencia.tipo_movimiento}
                          </span>
                        </td>
                        <td className="py-3 px-6 text-left">{new Date(transferencia.fecha_creacion).toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-4 px-6 text-center text-gray-500">
                        No se encontraron transferencias que coincidan con la búsqueda.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            {filteredTransferencias.length > itemsPerPage && (
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

export default React.memo(TransferenciasSedes);
