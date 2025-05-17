import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaDownload, FaSearch, FaUser, FaCalendarAlt, FaChartBar, FaChartLine } from 'react-icons/fa';
import { getHistorialPorUsuario } from '../../../api/informes.api';
import { CSVLink } from 'react-csv';
import Icon from '../../atomos/Icon';
import Grafica from '../../organismos/Grafica';
import Pdf from '../../organismos/Pdf';

interface HistorialUsuario {
  id_movimiento: number;
  id_usuario: number;
  nombre: string;
  apellido: string;
  email: string;
  nombre_material: string;
  codigo_sena: string;
  tipo_movimiento: string;
  fecha_creacion: string;
}

const HistorialPorUsuario: React.FC = () => {
  const [historial, setHistorial] = useState<HistorialUsuario[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);
  const [fechaInicio, setFechaInicio] = useState<string>('');
  const [fechaFin, setFechaFin] = useState<string>('');
  const [selectedUsuario, setSelectedUsuario] = useState<string>('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getHistorialPorUsuario(fechaInicio, fechaFin);
      setHistorial(data);
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
    setSelectedUsuario('');
    fetchData();
  };

  // Filtrar historial según el término de búsqueda y usuario seleccionado
  const filteredHistorial = historial.filter((item) => {
    const searchString = searchTerm.toLowerCase();
    const matchesSearch = (
      item.nombre.toLowerCase().includes(searchString) ||
      item.apellido.toLowerCase().includes(searchString) ||
      item.email.toLowerCase().includes(searchString) ||
      item.nombre_material.toLowerCase().includes(searchString) ||
      item.codigo_sena.toLowerCase().includes(searchString) ||
      item.tipo_movimiento.toLowerCase().includes(searchString)
    );
    
    const matchesUsuario = selectedUsuario 
      ? `${item.nombre} ${item.apellido}` === selectedUsuario || item.email === selectedUsuario
      : true;
    
    return matchesSearch && matchesUsuario;
  });

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredHistorial.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredHistorial.length / itemsPerPage);

  // Cambiar de página
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Preparar datos para exportar a CSV
  const csvData = [
    ['Usuario', 'Email', 'Material', 'Código SENA', 'Tipo Movimiento', 'Fecha'],
    ...filteredHistorial.map((item) => [
      `${item.nombre} ${item.apellido}`,
      item.email,
      item.nombre_material,
      item.codigo_sena,
      item.tipo_movimiento,
      new Date(item.fecha_creacion).toLocaleString()
    ])
  ];

  // Obtener lista de usuarios únicos
  const usuarios = Array.from(new Set(historial.map(item => `${item.nombre} ${item.apellido}`)));

  // Preparar datos para la gráfica de movimientos por tipo
  const movimientosPorTipo = filteredHistorial.reduce((acc, item) => {
    const tipo = item.tipo_movimiento;
    if (!acc[tipo]) {
      acc[tipo] = 0;
    }
    acc[tipo]++;
    return acc;
  }, {} as Record<string, number>);

  // Preparar datos para la gráfica de actividad por fecha
  const actividadPorFecha = filteredHistorial.reduce((acc, item) => {
    // Obtener solo la fecha (sin la hora)
    const fecha = new Date(item.fecha_creacion).toLocaleDateString();
    if (!acc[fecha]) {
      acc[fecha] = 0;
    }
    acc[fecha]++;
    return acc;
  }, {} as Record<string, number>);

  // Ordenar las fechas cronológicamente
  const fechasOrdenadas = Object.keys(actividadPorFecha).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  // Datos para gráfico de barras por tipo de movimiento
  const chartDataByTipoMovimiento = {
    labels: Object.keys(movimientosPorTipo),
    datasets: [
      {
        label: 'Cantidad de Movimientos',
        data: Object.values(movimientosPorTipo),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1
      }
    ]
  };

  // Datos para gráfico de línea por actividad en el tiempo
  const chartDataByFecha = {
    labels: fechasOrdenadas,
    datasets: [
      {
        label: 'Actividad por Fecha',
        data: fechasOrdenadas.map(fecha => actividadPorFecha[fecha]),
        fill: false,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1
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
          <h1 className="text-2xl font-bold text-gray-800">Historial por Usuario</h1>
        </div>
        <div className="flex items-center space-x-2">
          <CSVLink
            data={csvData}
            filename="historial_por_usuario.csv"
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded flex items-center"
          >
            <Icon icon={FaDownload} className="mr-2" /> Exportar CSV
          </CSVLink>
          <div className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
            <Pdf 
              title="Historial por Usuario"
              subtitle={`Reporte generado el ${new Date().toLocaleDateString()}`}
              data={filteredHistorial.map(item => ({
                'Usuario': `${item.nombre} ${item.apellido}`,
                'Email': item.email,
                'Material': item.nombre_material,
                'Código SENA': item.codigo_sena,
                'Tipo Movimiento': item.tipo_movimiento,
                'Fecha': new Date(item.fecha_creacion).toLocaleString()
              }))}
              fileName="historial_por_usuario.pdf"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Gráfica de movimientos por tipo */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Icon icon={FaChartBar} className="mr-2 text-purple-500" /> Movimientos por Tipo
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
                      text: 'Cantidad de Movimientos'
                    }
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Gráfica de actividad por fecha */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Icon icon={FaChartLine} className="mr-2 text-teal-500" /> Actividad por Fecha
          </h2>
          <div className="h-64">
            <Grafica 
              type="line"
              data={chartDataByFecha}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Cantidad de Actividades'
                    }
                  },
                  x: {
                    title: {
                      display: true,
                      text: 'Fecha'
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
            <div className="relative">
              <input
                type="date"
                className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
              <Icon icon={FaCalendarAlt} size={16} className="absolute right-3 top-3 text-gray-400" />
            </div>
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
            <div className="relative">
              <input
                type="date"
                className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
              />
              <Icon icon={FaCalendarAlt} size={16} className="absolute right-3 top-3 text-gray-400" />
            </div>
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
            <select
              className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedUsuario}
              onChange={(e) => setSelectedUsuario(e.target.value)}
            >
              <option value="">Todos los Usuarios</option>
              {usuarios.map((usuario) => (
                <option key={usuario} value={usuario}>{usuario}</option>
              ))}
            </select>
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por material, tipo..."
                className="w-full py-2 px-4 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Icon icon={FaSearch} size={16} className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-4">
          <button
            onClick={handleFiltrar}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mr-2"
          >
            Filtrar
          </button>
          <button
            onClick={handleLimpiarFiltros}
            className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
          >
            Limpiar Filtros
          </button>
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
                    <th className="py-3 px-6 text-left">Usuario</th>
                    <th className="py-3 px-6 text-left">Email</th>
                    <th className="py-3 px-6 text-left">Material</th>
                    <th className="py-3 px-6 text-left">Código SENA</th>
                    <th className="py-3 px-6 text-left">Tipo Movimiento</th>
                    <th className="py-3 px-6 text-left">Fecha</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm">
                  {currentItems.length > 0 ? (
                    currentItems.map((item) => (
                      <tr key={item.id_movimiento} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-6 text-left">
                          <div className="flex items-center">
                            <div className="mr-2 bg-purple-100 p-2 rounded-full">
                              <Icon icon={FaUser} size={16} className="text-purple-500" />
                            </div>
                            {`${item.nombre} ${item.apellido}`}
                          </div>
                        </td>
                        <td className="py-3 px-6 text-left">{item.email}</td>
                        <td className="py-3 px-6 text-left">{item.nombre_material}</td>
                        <td className="py-3 px-6 text-left">{item.codigo_sena}</td>
                        <td className="py-3 px-6 text-left">
                          <span className={`py-1 px-3 rounded-full text-xs ${
                            item.tipo_movimiento.toLowerCase().includes('entrada') 
                              ? 'bg-green-100 text-green-800' 
                              : item.tipo_movimiento.toLowerCase().includes('salida')
                                ? 'bg-red-100 text-red-800'
                                : item.tipo_movimiento.toLowerCase().includes('transferencia')
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-gray-100 text-gray-800'
                          }`}>
                            {item.tipo_movimiento}
                          </span>
                        </td>
                        <td className="py-3 px-6 text-left">{new Date(item.fecha_creacion).toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-4 px-6 text-center text-gray-500">
                        No se encontraron registros que coincidan con la búsqueda.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            {filteredHistorial.length > itemsPerPage && (
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

export default React.memo(HistorialPorUsuario);
