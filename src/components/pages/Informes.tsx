import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChartBar, FaUsers, FaBoxes, FaExchangeAlt, FaClipboardList, FaWarehouse, FaHistory, FaUserTag, FaArchive, FaChartLine } from 'react-icons/fa';
import Icon from '../atomos/Icon';

const Informes: React.FC = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const informes = [
    {
      id: 1,
      title: 'Materiales por Usuario',
      description: 'Lista de todos los materiales y el usuario responsable de cada uno.',
      icon: <Icon icon={FaUsers} size={24} className="text-blue-500" />,
      route: '/informes/materiales-por-usuario'
    },
    {
      id: 2,
      title: 'Inventario por Sede y Área',
      description: 'Cantidad y tipo de materiales disponibles en cada sede y área.',
      icon: <Icon icon={FaWarehouse} size={24} className="text-green-500" />,
      route: '/informes/inventario-por-sede-area'
    },
    {
      id: 3,
      title: 'Movimientos Históricos',
      description: 'Registro de entradas, salidas, transferencias y cambios de estado de los materiales.',
      icon: <Icon icon={FaHistory} size={24} className="text-purple-500" />,
      route: '/informes/movimientos-historicos'
    },
    {
      id: 4,
      title: 'Materiales con Stock Mínimo',
      description: 'Materiales cuyo stock está por debajo de un umbral definido.',
      icon: <Icon icon={FaBoxes} size={24} className="text-red-500" />,
      route: '/informes/materiales-stock-minimo'
    },
    {
      id: 5,
      title: 'Materiales Más Utilizados',
      description: 'Ranking de materiales por cantidad de movimientos o solicitudes.',
      icon: <Icon icon={FaChartLine} size={24} className="text-yellow-500" />,
      route: '/informes/materiales-mas-utilizados'
    },
    {
      id: 6,
      title: 'Usuarios con Más Materiales',
      description: 'Lista de usuarios ordenados por la cantidad de materiales a su cargo.',
      icon: <Icon icon={FaUserTag} size={24} className="text-indigo-500" />,
      route: '/informes/usuarios-con-mas-materiales'
    },
    {
      id: 7,
      title: 'Estado General del Inventario',
      description: 'Resumen de materiales disponibles, en uso, dañados, en reparación, etc.',
      icon: <Icon icon={FaChartBar} size={24} className="text-teal-500" />,
      route: '/informes/estado-inventario'
    },
    {
      id: 8,
      title: 'Transferencias entre Sedes',
      description: 'Informe de movimientos de materiales entre sedes o áreas.',
      icon: <Icon icon={FaExchangeAlt} size={24} className="text-orange-500" />,
      route: '/informes/transferencias-sedes'
    },
    {
      id: 9,
      title: 'Historial por Usuario',
      description: 'Qué materiales ha tenido cada usuario a lo largo del tiempo.',
      icon: <Icon icon={FaClipboardList} size={24} className="text-pink-500" />,
      route: '/informes/historial-por-usuario'
    },
    {
      id: 10,
      title: 'Materiales Dados de Baja',
      description: 'Lista de materiales que han sido retirados del inventario o marcados como fuera de servicio.',
      icon: <Icon icon={FaArchive} size={24} className="text-gray-500" />,
      route: '/informes/materiales-baja'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Informes y Reportes</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {informes.map((informe) => (
          <Link
            key={informe.id}
            to={informe.route}
            className={`bg-white rounded-lg shadow-md p-6 transition-all duration-300 transform ${
              hoveredCard === informe.id ? 'scale-105' : ''
            } hover:shadow-lg border border-gray-200`}
            onMouseEnter={() => setHoveredCard(informe.id)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-full bg-gray-100 mr-4">
                {informe.icon}
              </div>
              <h2 className="text-xl font-semibold text-gray-800">{informe.title}</h2>
            </div>
            <p className="text-gray-600">{informe.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default React.memo(Informes);
