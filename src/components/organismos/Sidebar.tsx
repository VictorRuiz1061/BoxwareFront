import { useState } from 'react';
import {
  Home,
  Users,
  Shield,
  Key,
  Box,
  Package,
  Boxes,
  RefreshCw,
  RotateCw,
  Building,
  Landmark,
  MapPin,
  Layout,
  Map,
  MapPinned,
  BookOpen,
  GraduationCap,
  Menu,
  LogOut,
  ChevronRight
} from 'lucide-react';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev =>
      prev.includes(groupName)
        ? prev.filter(g => g !== groupName)
        : [...prev, groupName]
    );
  };

  const menuGroups = [
    {
      icon: <Home size={20} />,
      label: "Inicio",
      path: "/dashboard",
      standalone: true
    },
    {
      icon: <Users size={20} />,
      label: "Administración",
      items: [
        { icon: <Users size={20} />, label: "Administradores", path: "/administrador" },
        { icon: <Users size={20} />, label: "Usuarios", path: "/usuarios" },
        { icon: <Shield size={20} />, label: "Roles", path: "/roles" },
        { icon: <Key size={20} />, label: "Permisos", path: "/permisos" },
      ]
    },
    {
      icon: <Box size={20} />,
      label: "Inventario",
      items: [
        { icon: <Box size={20} />, label: "Materiales", path: "/materiales" },
        { icon: <Package size={20} />, label: "Elementos", path: "/elementos" },
        { icon: <Boxes size={20} />, label: "Tipo Materiales", path: "/tipo_materiales" },
        { icon: <RefreshCw size={20} />, label: "Movimientos", path: "/movimientos" },
        { icon: <RotateCw size={20} />, label: "Tipos Movimiento", path: "/tipos_movimiento" },
      ]
    },
    {
      icon: <Building size={20} />,
      label: "Ubicaciones",
      items: [
        { icon: <Building size={20} />, label: "Sedes", path: "/sedes" },
        { icon: <Landmark size={20} />, label: "Centros", path: "/centros" },
        { icon: <MapPin size={20} />, label: "Municipios", path: "/municipios" },
        { icon: <Layout size={20} />, label: "Áreas", path: "/area" },
        { icon: <Map size={20} />, label: "Sitios", path: "/sitios" },
        { icon: <MapPinned size={20} />, label: "Tipos Sitio", path: "/tipos_sitio" },
      ]
    },
    {
      icon: <BookOpen size={20} />,
      label: "Educación",
      items: [
        { icon: <BookOpen size={20} />, label: "Programas", path: "/programas" },
        { icon: <GraduationCap size={20} />, label: "Fichas", path: "/fichas" }
      ]
    }
  ];

  return (
    <div className={`bg-gradient-to-b from-purple-900 to-indigo-900 text-white h-screen ${collapsed ? 'w-20' : 'w-64'} transition-all duration-300`}>
      {/* Encabezado del sidebar */}
      <div className="flex items-center justify-between p-4 border-b border-purple-700/50">
        {!collapsed && <span className="text-xl font-bold">Mi App</span>}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md hover:bg-purple-700/50 transition-colors duration-300" 
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Elementos del menú */}
      <div className="py-4 space-y-1">
        {menuGroups.map((group, index) => (
          <div key={index}>
            {group.standalone ? (
              <a
                href={group.path}
                className="flex items-center px-4 py-3 hover:bg-indigo-600 hover:pl-5 transition-all duration-300 rounded-md cursor-pointer"
              >
                <div className="mr-3">{group.icon}</div>
                {!collapsed && <span>{group.label}</span>}
              </a>
            ) : (
              <div>
                <div
                  onClick={() => !collapsed && toggleGroup(group.label)}
                  className="flex items-center px-4 py-3 hover:bg-purple-700/50 hover:pl-5 transition-all duration-300 rounded-md cursor-pointer"
                >
                  <div className="mr-3">{group.icon}</div>
                  {!collapsed && (
                    <>
                      <span className="flex-grow">{group.label}</span>
                      <ChevronRight
                        size={20}
                        className={`transition-transform duration-300 ${
                          expandedGroups.includes(group.label) ? 'rotate-90' : ''
                        }`}
                      />
                    </>
                  )}
                </div>

                {/* Submenú con animación */}
                <div
                  className={`pl-4 bg-purple-800/30 transition-all duration-300 ease-in-out overflow-hidden ${
                    expandedGroups.includes(group.label) ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  {group.items?.map((item, itemIndex) => (
                    <a
                      key={itemIndex}
                      href={item.path}
                      className="flex items-center px-4 py-2 hover:bg-purple-700/50 transition-colors duration-300 rounded-md cursor-pointer"
                    >
                      <div className="mr-3">{item.icon}</div>
                      <span>{item.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Botón de cerrar sesión */}
      <div className="absolute bottom-0 w-full border-t border-purple-700/50">
        <a href="/iniciosecion" className="flex items-center px-4 py-3 hover:bg-purple-700/50 hover:pl-5 transition-all duration-300 rounded-md cursor-pointer">
          <div className="mr-3"><LogOut size={20} /></div>
          {!collapsed && <span>Cerrar Sesión</span>}
        </a>
      </div>
    </div>
  );
};

export default Sidebar;
