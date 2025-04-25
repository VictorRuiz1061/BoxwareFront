import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
import AnimatedContainer from '../atomos/AnimatedContainer';
import AlertDialog from '../atomos/AlertDialog';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    navigate('/iniciosesion');
  };

  const confirmLogout = () => {
    setShowLogoutAlert(true);
  };
  
  // Función para verificar si un elemento está activo
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  // Función para verificar si algún elemento de un grupo está activo
  const isGroupActive = (items: any[] | undefined) => {
    return items ? items.some(item => location.pathname === item.path) : false;
  };

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
        { icon: <Users size={20} />, label: "Modulos", path: "/modulos" },
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
    <>
      <AnimatedContainer
        animation="slideFromLeft"
        duration={400}
        className={`bg-gray-300 text-black h-screen ${collapsed ? 'w-20' : 'w-64'} transition-all duration-300 shadow-md flex flex-col overflow-hidden`}
      >
        {/* Encabezado del sidebar */}
        <AnimatedContainer
          animation="fadeIn"
          duration={600}
          delay={200}
          className="flex items-center justify-between p-4 border-b border-gray-300 bg-gray-300">

          {!collapsed && <span className="text-xl font-bold text-blue-600">BoxWare</span>}
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-md hover:bg-gray-900 text-gray-600 transition-colors duration-300" 
          >
            <Menu size={24} />
          </button>
        </AnimatedContainer>

        {/* Elementos del menú */}
        <div className="py-4 space-y-1 overflow-hidden">
          {menuGroups.map((group, index) => (
            <AnimatedContainer
              key={index}
              animation="slideUp"
              delay={100 + index * 50}
              duration={400}
              className="w-full"
            >
            <div>
              {group.standalone ? (
                <a
                  href={group.path}
                  className={`flex items-center px-4 py-3 ${isActive(group.path) ? 'bg-blue-500 text-black' : 'hover:bg-gray-400 text-black hover:text-blue-600'} hover:pl-5 transition-all duration-300 rounded-md cursor-pointer font-medium`}
                >
                  <div className="mr-3">{group.icon}</div>
                  {!collapsed && <span>{group.label}</span>}
                </a>
              ) : (
                <div>
                  <div
                    onClick={() => !collapsed && toggleGroup(group.label)}
                    className={`flex items-center px-4 py-3 ${isGroupActive(group.items) ? 'bg-blue-500 text-black' : 'hover:bg-gray-400 text-black hover:text-blue-600'} hover:pl-5 transition-all duration-300 rounded-md cursor-pointer font-medium`}
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
                    className={`pl-4 bg-gray-300 transition-all duration-300 ease-in-out overflow-hidden ${
                      expandedGroups.includes(group.label) ? 'max-h-96' : 'max-h-0'
                    }`}
                  >
                    {group.items?.map((item, itemIndex) => (
                      <AnimatedContainer
                        key={itemIndex}
                        animation="slideFromRight"
                        delay={itemIndex * 50}
                        duration={300}
                        className="w-full"
                      >
                      <a
                        href={item.path}
                        className={`flex items-center px-4 py-2 ${isActive(item.path) ? 'bg-blue-500 text-black' : 'hover:bg-gray-400 text-black hover:text-blue-600'} transition-colors duration-300 rounded-md cursor-pointer font-medium`}
                      >
                        <div className="mr-3">{item.icon}</div>
                        <span>{item.label}</span>
                      </a>
                      </AnimatedContainer>
                    ))}
                  </div>
                </div>
              )}
            </div>
            </AnimatedContainer>
          ))}
        </div>

        {/* Botón de cerrar sesión */}
        <AnimatedContainer
          animation="slideUp"
          delay={500}
          duration={400}
          className="mt-auto border-t border-gray-300 bg-gray-300"
        >
          <div className="px-3 py-3">
            <button 
              onClick={confirmLogout} 
              className="flex items-center px-3 py-2 text-black hover:text-blue-600 hover:bg-gray-400 transition-colors duration-300 cursor-pointer w-full text-left rounded-md font-medium"
            >
              <div className="mr-3">
                <LogOut size={20} />
              </div>
              {!collapsed && <span>Cerrar Sesión</span>}
            </button>
          </div>
        </AnimatedContainer>
      </AnimatedContainer>

      <AlertDialog
        isOpen={showLogoutAlert}
        title="Cerrar Sesión"
        message="¿Estás seguro de que deseas cerrar sesión?"
        confirmText="Sí, cerrar sesión"
        cancelText="Cancelar"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutAlert(false)}
      />
    </>
  );
};

export default Sidebar;
