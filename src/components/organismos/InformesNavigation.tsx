import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaChartBar, FaUsers, FaBoxes, FaExchangeAlt, FaClipboardList, FaWarehouse, 
  FaHistory, FaUserTag, FaArchive, FaChartLine, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import Icon from '../atomos/Icon';

interface InformeLink {
  id: number;
  title: string;
  icon: JSX.Element;
  route: string;
}

const InformesNavigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  const informes: InformeLink[] = [
    {
      id: 1,
      title: 'Materiales por Usuario',
      icon: <Icon icon={FaUsers} size={20} className="text-blue-500" />,
      route: '/informes/materiales-por-usuario'
    },
    {
      id: 2,
      title: 'Inventario por Sede y Área',
      icon: <Icon icon={FaWarehouse} size={20} className="text-green-500" />,
      route: '/informes/inventario-por-sede-area'
    },
    {
      id: 3,
      title: 'Movimientos Históricos',
      icon: <Icon icon={FaHistory} size={20} className="text-purple-500" />,
      route: '/informes/movimientos-historicos'
    },
    {
      id: 4,
      title: 'Materiales con Stock Mínimo',
      icon: <Icon icon={FaBoxes} size={20} className="text-red-500" />,
      route: '/informes/materiales-stock-minimo'
    },
    {
      id: 5,
      title: 'Materiales Más Utilizados',
      icon: <Icon icon={FaChartLine} size={20} className="text-yellow-500" />,
      route: '/informes/materiales-mas-utilizados'
    },
    {
      id: 6,
      title: 'Usuarios con Más Materiales',
      icon: <Icon icon={FaUserTag} size={20} className="text-indigo-500" />,
      route: '/informes/usuarios-con-mas-materiales'
    },
    {
      id: 7,
      title: 'Estado General del Inventario',
      icon: <Icon icon={FaChartBar} size={20} className="text-teal-500" />,
      route: '/informes/estado-inventario'
    },
    {
      id: 8,
      title: 'Transferencias entre Sedes',
      icon: <Icon icon={FaExchangeAlt} size={20} className="text-orange-500" />,
      route: '/informes/transferencias-sedes'
    },
    {
      id: 9,
      title: 'Historial por Usuario',
      icon: <Icon icon={FaClipboardList} size={20} className="text-pink-500" />,
      route: '/informes/historial-por-usuario'
    },
    {
      id: 10,
      title: 'Materiales Dados de Baja',
      icon: <Icon icon={FaArchive} size={20} className="text-gray-500" />,
      route: '/informes/materiales-baja'
    }
  ];

  // Encuentra el informe actual basado en la ruta
  const currentReport = informes.find(informe => location.pathname === informe.route) || informes[0];

  return (
    <div className="mb-6">
      <div className="relative">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full p-3 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none"
        >
          <div className="flex items-center">
            {currentReport.icon}
            <span className="ml-2 font-medium">{currentReport.title}</span>
          </div>
          <Icon icon={isOpen ? FaChevronUp : FaChevronDown} size={16} className="text-gray-500" />
        </button>
        
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-96 overflow-y-auto">
            <div className="p-2">
              <Link to="/informes" className="flex items-center p-2 hover:bg-gray-100 rounded-md">
                <span className="font-medium text-blue-600">← Volver a todos los informes</span>
              </Link>
              <div className="border-t border-gray-200 my-2"></div>
              {informes.map(informe => (
                <Link
                  key={informe.id}
                  to={informe.route}
                  className={`flex items-center p-2 ${location.pathname === informe.route ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'} rounded-md`}
                  onClick={() => setIsOpen(false)}
                >
                  <div className="mr-2">{informe.icon}</div>
                  <span>{informe.title}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InformesNavigation;
