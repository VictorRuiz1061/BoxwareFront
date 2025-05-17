import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaDownload, FaSearch, FaChartBar, FaChartPie, FaCalendarAlt } from 'react-icons/fa';
import { getMaterialesBaja } from '../../../api/informes.api';
import { CSVLink } from 'react-csv';
import Icon from '../../atomos/Icon';
import Grafica from '../../organismos/Grafica';
import Pdf from '../../organismos/Pdf';
import InformesNavigation from '../../organismos/InformesNavigation';

interface MaterialBaja {
  id_material: number;
  nombre_material: string;
  codigo_sena: string;
  descripcion_material: string;
  fecha_baja: string;
  motivo_baja: string;
  usuario_responsable: string;
}

const MaterialesBaja: React.FC = () => {
  const [materiales, setMateriales] = useState<MaterialBaja[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);
  const [selectedMotivo, setSelectedMotivo] = useState<string>('');
  const [fechaInicio, setFechaInicio] = useState<string>('');
  const [fechaFin, setFechaFin] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getMaterialesBaja();
        setMateriales(data);
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

  const handleLimpiarFiltros = () => {
    setSelectedMotivo('');
    setFechaInicio('');
    setFechaFin('');
    setSearchTerm('');
  };

  // Filtrar materiales según el término de búsqueda, motivo y fechas
  const filteredMateriales = materiales.filter((material) => {
    const searchString = searchTerm.toLowerCase();
    const matchesSearch = (
      (material.nombre_material?.toLowerCase() || '').includes(searchString) ||
      (material.codigo_sena?.toLowerCase() || '').includes(searchString) ||
      (material.descripcion_material?.toLowerCase() || '').includes(searchString) ||
      (material.motivo_baja?.toLowerCase() || '').includes(searchString) ||
      (material.usuario_responsable?.toLowerCase() || '').includes(searchString)
    );
    
    const matchesMotivo = selectedMotivo ? material.motivo_baja === selectedMotivo : true;
    
    // Filtrar por fecha
    let matchesFecha = true;
    if (fechaInicio) {
      const fechaBaja = new Date(material.fecha_baja);
      const inicio = new Date(fechaInicio);
      matchesFecha = fechaBaja >= inicio;
    }
    if (fechaFin && matchesFecha) {
      const fechaBaja = new Date(material.fecha_baja);
      const fin = new Date(fechaFin);
      fin.setHours(23, 59, 59); // Establecer al final del día
      matchesFecha = fechaBaja <= fin;
    }
    
    return matchesSearch && matchesMotivo && matchesFecha;
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
    ['Código SENA', 'Nombre Material', 'Descripción', 'Fecha Baja', 'Motivo', 'Usuario Responsable'],
    ...filteredMateriales.map((material) => [
      material.codigo_sena,
      material.nombre_material,
      material.descripcion_material,
      new Date(material.fecha_baja).toLocaleString(),
      material.motivo_baja,
      material.usuario_responsable
    ])
  ];

  // Obtener lista de motivos únicos
  const motivos = Array.from(new Set(materiales
    .filter(material => material.motivo_baja) // Filtrar valores null o undefined
    .map(material => material.motivo_baja)
  ));

  // Preparar datos para la gráfica de materiales por motivo de baja
  const materialesPorMotivo = filteredMateriales.reduce((acc, material) => {
    const motivo = material.motivo_baja;
    if (!acc[motivo]) {
      acc[motivo] = 0;
    }
    acc[motivo]++;
    return acc;
  }, {} as Record<string, number>);

  // Preparar datos para la gráfica de bajas por mes
  const bajasPorMes = filteredMateriales.reduce((acc, material) => {
    const fecha = new Date(material.fecha_baja);
    const mes = fecha.toLocaleString('default', { month: 'long', year: 'numeric' });
    if (!acc[mes]) {
      acc[mes] = 0;
    }
    acc[mes]++;
    return acc;
  }, {} as Record<string, number>);

  // Ordenar los meses cronológicamente
  const mesesOrdenados = Object.keys(bajasPorMes).sort((a, b) => {
    const fechaA = new Date(a);
    const fechaB = new Date(b);
    return fechaA.getTime() - fechaB.getTime();
  });

  // Datos para gráfico circular por motivo de baja
  const chartDataByMotivo = {
    labels: Object.keys(materialesPorMotivo),
    datasets: [
      {
        label: 'Materiales por Motivo de Baja',
        data: Object.values(materialesPorMotivo),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(199, 199, 199, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(199, 199, 199, 1)',
        ],
        borderWidth: 1
      }
    ]
  };

  // Datos para gráfico de barras por mes
  const chartDataByMes = {
    labels: mesesOrdenados,
    datasets: [
      {
        label: 'Bajas por Mes',
        data: mesesOrdenados.map(mes => bajasPorMes[mes]),
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
          <h1 className="text-2xl font-bold text-gray-800">Materiales Dados de Baja</h1>
        </div>
        <div className="flex items-center space-x-2">
          <CSVLink
            data={csvData}
            filename="materiales_baja.csv"
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded flex items-center"
          >
            <Icon icon={FaDownload} className="mr-2" /> Exportar CSV
          </CSVLink>
          <div className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
            <Pdf 
              title="Materiales Dados de Baja"
              subtitle={`Reporte generado el ${new Date().toLocaleDateString()}`}
              data={filteredMateriales.map(material => ({
                'Código SENA': material.codigo_sena,
                'Material': material.nombre_material,
                'Descripción': material.descripcion_material,
                'Fecha Baja': new Date(material.fecha_baja).toLocaleString(),
                'Motivo': material.motivo_baja,
                'Usuario': material.usuario_responsable
              }))}
              fileName="materiales_baja.pdf"
            />
          </div>
        </div>
      </div>
      
      {/* Navegación entre informes */}
      <InformesNavigation />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Gráfica circular por motivo de baja */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Icon icon={FaChartPie} className="mr-2 text-red-500" /> Materiales por Motivo de Baja
          </h2>
          <div className="h-64">
            <Grafica 
              type="pie"
              data={chartDataByMotivo}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right',
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Gráfica de barras por mes */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Icon icon={FaChartBar} className="mr-2 text-teal-500" /> Bajas por Mes
          </h2>
          <div className="h-64">
            <Grafica 
              type="bar"
              data={chartDataByMes}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Cantidad de Bajas'
                    }
                  },
                  x: {
                    title: {
                      display: true,
                      text: 'Mes'
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Motivo de Baja</label>
            <select
              className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedMotivo}
              onChange={(e) => setSelectedMotivo(e.target.value)}
            >
              <option value="">Todos los Motivos</option>
              {motivos.map((motivo) => (
                <option key={motivo} value={motivo}>{motivo}</option>
              ))}
            </select>
          </div>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
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

        <div className="flex justify-center mb-4">
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
                    <th className="py-3 px-6 text-left">Código SENA</th>
                    <th className="py-3 px-6 text-left">Nombre Material</th>
                    <th className="py-3 px-6 text-left">Descripción</th>
                    <th className="py-3 px-6 text-left">Fecha Baja</th>
                    <th className="py-3 px-6 text-left">Motivo</th>
                    <th className="py-3 px-6 text-left">Usuario Responsable</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm">
                  {currentItems.length > 0 ? (
                    currentItems.map((material) => (
                      <tr key={material.id_material} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-6 text-left">{material.codigo_sena}</td>
                        <td className="py-3 px-6 text-left">{material.nombre_material}</td>
                        <td className="py-3 px-6 text-left">{material.descripcion_material}</td>
                        <td className="py-3 px-6 text-left">{new Date(material.fecha_baja).toLocaleString()}</td>
                        <td className="py-3 px-6 text-left">
                          <span className={`py-1 px-3 rounded-full text-xs ${
                            material.motivo_baja && material.motivo_baja.toLowerCase ? (
                              material.motivo_baja.toLowerCase().includes('obsoleto') 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : material.motivo_baja.toLowerCase().includes('daño')
                                  ? 'bg-red-100 text-red-800'
                                  : material.motivo_baja.toLowerCase().includes('perdida')
                                    ? 'bg-purple-100 text-purple-800'
                                    : 'bg-gray-100 text-gray-800'
                            ) : 'bg-gray-100 text-gray-800'
                          }`}>
                            {material.motivo_baja || 'No especificado'}
                          </span>
                        </td>
                        <td className="py-3 px-6 text-left">{material.usuario_responsable}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-4 px-6 text-center text-gray-500">
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

export default React.memo(MaterialesBaja);
