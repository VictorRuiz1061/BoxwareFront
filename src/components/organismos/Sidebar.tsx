import { useState } from 'react';
import { Home, Users, Settings, Menu, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  // Elementos del menú simplificados
  const menuItems = [
    { icon: <Home size={20} />, label: "Inicio", path: "/dashboard" },
    { icon: <Users size={20} />, label: "Usuarios", path: "/usuarios" },
    { icon: <Settings size={20} />, label: "Materiales", path: "/materiales" },
    { icon: <Settings size={20} />, label: "Elementos", path: "/elementos" },
    { icon: <Settings size={20} />, label: "Configuración", path: "/settings" },
    { icon: <Settings size={20} />, label: "Roles", path: "/roles" },
    { icon: <Settings size={20} />, label: "Movimientos", path: "/movimientos" },
    { icon: <Settings size={20} />, label: "Tipos de Movimiento", path: "/tipos-movimiento" },
    { icon: <Settings size={20} />, label: "Tipos de Sitio", path: "/tipos-sitio" }
  ];

  return (
    <div className={`bg-indigo-800 text-white h-screen ${collapsed ? 'w-20' : 'w-64'} transition-all duration-300`}>
      {/* Encabezado del sidebar */}
      <div className="flex items-center justify-between p-4 border-b border-indigo-700">
        {!collapsed && <span className="text-xl font-bold">Mi App</span>}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md hover:bg-indigo-700" 
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Elementos del menú */}
      <div className="py-4">
        {menuItems.map((item, index) => (
          <div 
            key={index} 
            onClick={() => navigate(item.path)}
            className="flex items-center px-4 py-3 hover:bg-indigo-700 cursor-pointer"
          >
            <div className="mr-3">{item.icon}</div>
            {!collapsed && <span>{item.label}</span>}
          </div>
        ))}
      </div>

      {/* Botón de cerrar sesión */}
      <div className="absolute bottom-0 w-full border-t border-indigo-700">
        <div 
          onClick={() => navigate('/iniciosecion')} 
          className="flex items-center px-4 py-3 hover:bg-indigo-700 cursor-pointer"
        >
          <div className="mr-3"><LogOut size={20} /></div>
          {!collapsed && <span>Cerrar Sesión</span>}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;