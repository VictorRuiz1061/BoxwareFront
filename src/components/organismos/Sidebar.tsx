import { useState } from 'react';
import { Home, Users, Box, Archive, Map, Landmark, Building, School, Key, Shield, Layers, Settings, Menu, LogOut } from 'lucide-react';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  // Elementos del menú con iconos correspondientes
  const menuItems = [
    { icon: <Home size={20} />, label: "Inicio", path: "/dashboard" },
    { icon: <Users size={20} />, label: "Usuarios", path: "/usuarios" },
    { icon: <Box size={20} />, label: "Materiales", path: "/materiales" },
    { icon: <Archive size={20} />, label: "Elementos", path: "/elementos" },
    { icon: <Map size={20} />, label: "Sitios", path: "/sitios" },
    { icon: <Landmark size={20} />, label: "Municipios", path: "/municipios" },
    { icon: <Building size={20} />, label: "Sedes", path: "/sedes" },
    { icon: <School size={20} />, label: "Centros", path: "/centros" },
    { icon: <Key size={20} />, label: "Permisos", path: "/permisos" },
    { icon: <Shield size={20} />, label: "Administrador", path: "/administrador" },
    { icon: <Layers size={20} />, label: "Tipo Materiales", path: "/tipo_materiales" },
    { icon: <Settings size={20} />, label: "area", path: "/area" },
    { icon: <Settings size={20} />, label: "programas", path: "/programa" },
    { icon: <Settings size={20} />, label: "fichas", path: "/fichas" },
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
          <a 
            key={index} 
            href={item.path}
            className="flex items-center px-4 py-3 hover:bg-indigo-700 cursor-pointer"
          >
            <div className="mr-3">{item.icon}</div>
            {!collapsed && <span>{item.label}</span>}
          </a>
        ))}
      </div>

      {/* Botón de cerrar sesión */}
      <div className="absolute bottom-0 w-64 border-t border-indigo-700">
        <a href="/iniciosecion" className="flex items-center px-4 py-3 hover:bg-indigo-700 cursor-pointer">
          <div className="mr-3"><LogOut size={20} /></div>
          {!collapsed && <span>Cerrar Sesión</span>}
        </a>
      </div>
    </div>
  );
};

export default Sidebar;
