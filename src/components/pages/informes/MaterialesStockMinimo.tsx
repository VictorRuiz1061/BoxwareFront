import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaDownload, FaSearch, FaExclamationTriangle, FaBoxes } from 'react-icons/fa';
import { getMaterialesStockMinimo } from '../../../api/informes.api';
import { CSVLink } from 'react-csv';
import Icon from '../../atomos/Icon';
import InformesNavigation from '../../organismos/InformesNavigation';

interface Material {
  id_material: number;
  codigo_sena: string;
  nombre_material: string;
  descripcion_material: string;
  stock: number;
  unidad_medida: string;
  categoria_id: {
    id_categoria_elemento: number;
    nombre_categoria: string;
  };
  tipo_material_id: {
    id_tipo_material: number;
    tipo_material: string;
  };
  sitio_id: {
    id_sitio: number;
    nombre_sitio: string;
  };
}

const MaterialesStockMinimo: React.FC = () => {
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);
  const [stockMinimo, setStockMinimo] = useState<number>(10);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getMaterialesStockMinimo(stockMinimo);
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
      material.codigo_sena.toLowerCase().includes(searchString) ||
      material.descripcion_material.toLowerCase().includes(searchString) ||
      material.categoria_id?.nombre_categoria.toLowerCase().includes(searchString) ||
      material.tipo_material_id?.tipo_material.toLowerCase().includes(searchString) ||
      material.sitio_id?.nombre_sitio.toLowerCase().includes(searchString)
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
    ['Código SENA', 'Nombre Material', 'Descripción', 'Stock', 'Unidad de Medida', 'Categoría', 'Tipo Material', 'Ubicación'],
    ...filteredMateriales.map((material) => [
      material.codigo_sena,
      material.nombre_material,
      material.descripcion_material,
      material.stock,
      material.unidad_medida,
      material.categoria_id?.nombre_categoria || 'N/A',
      material.tipo_material_id?.tipo_material || 'N/A',
      material.sitio_id?.nombre_sitio || 'N/A'
    ])
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Link to="/informes" className="mr-4">
            <Icon icon={FaArrowLeft} className="text-gray-600 hover:text-gray-800" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Materiales con Stock Mínimo</h1>
        </div>
        <div className="flex items-center">
          <CSVLink
            data={csvData}
            filename="materiales_stock_minimo.csv"
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded flex items-center mr-2"
          >
            <Icon icon={FaDownload} className="mr-2" /> Exportar CSV
          </CSVLink>
        </div>
      </div>

      {/* Navegación entre informes */}
      <InformesNavigation />

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        {/* Alerta de información */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <Icon icon={FaExclamationTriangle} size={20} className="text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Este informe muestra los materiales cuyo stock está por debajo o igual al umbral definido.
                Ajuste el valor del stock mínimo según sus necesidades.
              </p>
            </div>
          </div>
        </div>

        {/* Filtro de stock mínimo */}
        <div className="flex items-center mb-6">
          <div className="w-64 mr-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock Mínimo</label>
            <input
              type="number"
              min="0"
              className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={stockMinimo}
              onChange={(e) => setStockMinimo(Number(e.target.value))}
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleFiltrar}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            >
              Filtrar
            </button>
          </div>
        </div>

        <div className="flex items-center mb-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Buscar por nombre, código, categoría..."
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
                    <th className="py-3 px-6 text-left">Código SENA</th>
                    <th className="py-3 px-6 text-left">Nombre Material</th>
                    <th className="py-3 px-6 text-center">Stock</th>
                    <th className="py-3 px-6 text-left">Unidad de Medida</th>
                    <th className="py-3 px-6 text-left">Categoría</th>
                    <th className="py-3 px-6 text-left">Tipo Material</th>
                    <th className="py-3 px-6 text-left">Ubicación</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm">
                  {currentItems.length > 0 ? (
                    currentItems.map((material) => (
                      <tr key={material.id_material} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-6 text-left">{material.codigo_sena}</td>
                        <td className="py-3 px-6 text-left">
                          <div className="flex items-center">
                            <div className="mr-2 bg-blue-100 p-2 rounded-full">
                              <Icon icon={FaBoxes} size={16} className="text-blue-500" />
                            </div>
                            {material.nombre_material}
                          </div>
                        </td>
                        <td className="py-3 px-6 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            material.stock <= 5 ? 'bg-red-100 text-red-800' :
                            material.stock <= 10 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {material.stock} {material.unidad_medida}
                          </span>
                        </td>
                        <td className="py-3 px-6 text-left">{material.unidad_medida}</td>
                        <td className="py-3 px-6 text-left">{material.categoria_id?.nombre_categoria || 'N/A'}</td>
                        <td className="py-3 px-6 text-left">{material.tipo_material_id?.tipo_material || 'N/A'}</td>
                        <td className="py-3 px-6 text-left">{material.sitio_id?.nombre_sitio || 'N/A'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-4 px-6 text-center text-gray-500">
                        No se encontraron materiales que coincidan con la búsqueda o el stock mínimo definido.
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

export default React.memo(MaterialesStockMinimo);
