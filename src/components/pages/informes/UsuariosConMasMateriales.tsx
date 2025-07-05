import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaDownload, FaSearch, FaUserTag, FaChartBar } from 'react-icons/fa';
import { getUsuariosConMasMateriales } from '../../../api/informes.api';
import { CSVLink } from 'react-csv';
import Icon from '../../atomos/Icon';
import Grafica from '../../organismos/Grafica';
import Pdf from '../../organismos/Pdf';

interface Usuario {
  id_usuario: number;
  nombre: string;
  apellido: string;
  email: string;
  total_materiales: number;
}

const UsuariosConMasMateriales: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);
  const [limite, setLimite] = useState<number>(10);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getUsuariosConMasMateriales(limite);
      setUsuarios(data);
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

  // Filtrar usuarios según el término de búsqueda
  const filteredUsuarios = usuarios.filter((usuario) => {
    const searchString = searchTerm.toLowerCase();
    return (
      usuario.nombre.toLowerCase().includes(searchString) ||
      usuario.apellido.toLowerCase().includes(searchString) ||
      usuario.email.toLowerCase().includes(searchString)
    );
  });

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsuarios.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsuarios.length / itemsPerPage);

  // Cambiar de página
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Preparar datos para exportar a CSV
  const csvData = [
    ['ID', 'Nombre', 'Apellido', 'Email', 'Total Materiales'],
    ...filteredUsuarios.map((usuario) => [
      usuario.id_usuario,
      usuario.nombre,
      usuario.apellido,
      usuario.email,
      usuario.total_materiales
    ])
  ];

  // Calcular el usuario con más materiales para mostrar un porcentaje relativo
  const maxMateriales = usuarios.length > 0 
    ? Math.max(...usuarios.map(u => u.total_materiales)) 
    : 0;

  // Preparar datos para la gráfica
  const chartData = {
    labels: currentItems.map(usuario => `${usuario.nombre} ${usuario.apellido}`),
    datasets: [
      {
        label: 'Total Materiales',
        data: currentItems.map(usuario => usuario.total_materiales),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
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
          text: 'Cantidad de Materiales'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Usuarios'
        }
      }
    },
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link to="/informes" className="mr-4">
            <Icon icon={FaArrowLeft} className="text-gray-600 hover:text-gray-800" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Usuarios con Más Materiales</h1>
        </div>
        <div className="flex items-center space-x-2">
          <CSVLink
            data={csvData}
            filename="usuarios_con_mas_materiales.csv"
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded flex items-center"
          >
            <Icon icon={FaDownload} className="mr-2" /> Exportar CSV
          </CSVLink>
          <div className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
            <Pdf 
              title="Usuarios con Más Materiales"
              subtitle={`Reporte generado el ${new Date().toLocaleDateString()}`}
              data={filteredUsuarios.map(usuario => ({
                ID: usuario.id_usuario,
                Nombre: usuario.nombre,
                Apellido: usuario.apellido,
                Email: usuario.email,
                'Total Materiales': usuario.total_materiales
              }))}
              fileName="usuarios_con_mas_materiales.pdf"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Gráfica */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Icon icon={FaChartBar} className="mr-2 text-blue-500" /> Gráfico de Usuarios con Más Materiales
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Límite de Usuarios</label>
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
              placeholder="Buscar por nombre, apellido, email..."
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
                    <th className="py-3 px-6 text-left">Nombre</th>
                    <th className="py-3 px-6 text-left">Email</th>
                    <th className="py-3 px-6 text-center">Total Materiales</th>
                    <th className="py-3 px-6 text-left">Distribución</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm">
                  {currentItems.length > 0 ? (
                    currentItems.map((usuario) => {
                      // Calcular el porcentaje relativo al usuario con más materiales
                      const porcentaje = (usuario.total_materiales / maxMateriales) * 100;
                      
                      return (
                        <tr key={usuario.id_usuario} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="py-3 px-6 text-left">
                            <div className="flex items-center">
                              <div className="mr-2 bg-indigo-100 p-2 rounded-full">
                                <Icon icon={FaUserTag} size={16} className="text-indigo-500" />
                              </div>
                              {usuario.nombre} {usuario.apellido}
                            </div>
                          </td>
                          <td className="py-3 px-6 text-left">{usuario.email}</td>
                          <td className="py-3 px-6 text-center">
                            <span className="bg-indigo-100 text-indigo-800 py-1 px-3 rounded-full text-xs">
                              {usuario.total_materiales}
                            </span>
                          </td>
                          <td className="py-3 px-6 text-left">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div 
                                className="bg-indigo-600 h-2.5 rounded-full" 
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
                        No se encontraron usuarios que coincidan con la búsqueda.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            {filteredUsuarios.length > itemsPerPage && (
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

export default React.memo(UsuariosConMasMateriales);
