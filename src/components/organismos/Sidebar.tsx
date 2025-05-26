import { useState, Fragment } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Home, Users, Shield, Key, Box, Package, Boxes, RefreshCw, RotateCw,
  Building, Landmark, MapPin, Layout, Map, MapPinned, BookOpen, GraduationCap, Menu, LogOut,
  ChevronRight, BarChart, FileText, PieChart, TrendingUp } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { Dialog, Transition } from "@headlessui/react";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem("auth-token");
    // Eliminar la cookie del token
    document.cookie = "token=; path=/; max-age=0; samesite=strict";
    document.cookie = "token=; max-age=0; samesite=strict";
    navigate("/");
  };

  const confirmLogout = () => {
    setShowLogoutDialog(true);
  };

  // Función para verificar si un elemento está activo
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Función para verificar si algún elemento de un grupo está activo
  const isGroupActive = (items: any[] | undefined) => {
    return items
      ? items.some((item) => location.pathname === item.path)
      : false;
  };

  const toggleGroup = (groupName: string) => {
    setExpandedGroups((prev) =>
      prev.includes(groupName)
        ? prev.filter((g) => g !== groupName)
        : [...prev, groupName]
    );
  };

  const menuGroups = [
    {
      icon: <Home size={20} />,
      label: "Inicio",
      path: "/dashboard",
      standalone: true,
    },
    {
      icon: <Users size={20} />,
      label: "Administración",
      items: [
        { icon: <Users size={20} />, label: "Modulos", path: "/modulos" },
        { icon: <Users size={20} />, label: "Usuarios", path: "/usuarios" },
        { icon: <Shield size={20} />, label: "Roles", path: "/roles" },
        { icon: <Key size={20} />, label: "Permisos", path: "/permisos" },
      ],
    },
    {
      icon: <Box size={20} />,
      label: "Inventario",
      items: [
        { icon: <Box size={20} />, label: "Materiales", path: "/materiales" },
        { icon: <Package size={20} />, label: "Elementos", path: "/elementos" },
        {
          icon: <Boxes size={20} />,
          label: "Tipo Materiales",
          path: "/tipo_materiales",
        },
        {
          icon: <RefreshCw size={20} />,
          label: "Movimientos",
          path: "/movimientos",
        },
        {
          icon: <RotateCw size={20} />,
          label: "Tipos Movimiento",
          path: "/tipos_movimiento",
        },
      ],
    },
    {
      icon: <Building size={20} />,
      label: "Ubicaciones",
      items: [
        { icon: <Building size={20} />, label: "Sedes", path: "/sedes" },
        { icon: <Landmark size={20} />, label: "Centros", path: "/centros" },
        {
          icon: <MapPin size={20} />,
          label: "Municipios",
          path: "/municipios",
        },
        { icon: <Layout size={20} />, label: "Áreas", path: "/area" },
        { icon: <Map size={20} />, label: "Sitios", path: "/sitios" },
        {
          icon: <MapPinned size={20} />,
          label: "Tipos Sitio",
          path: "/tipos_sitio",
        },
      ],
    },
    {
      icon: <BookOpen size={20} />,
      label: "Educación",
      items: [
        {
          icon: <BookOpen size={20} />,
          label: "Programas",
          path: "/programas",
        },
        { icon: <GraduationCap size={20} />, label: "Fichas", path: "/fichas" },
      ],
    },
    {
      icon: <BarChart size={20} />,
      label: "Informes",
      items: [
        {
          icon: <BarChart size={20} />,
          label: "Todos los Informes",
          path: "/informes",
        },
        {
          icon: <TrendingUp size={20} />,
          label: "Movimientos Históricos",
          path: "/informes/movimientos-historicos",
        },
        {
          icon: <BarChart size={20} />,
          label: "Materiales Más Utilizados",
          path: "/informes/materiales-mas-utilizados",
        },
        {
          icon: <PieChart size={20} />,
          label: "Estado Inventario",
          path: "/informes/estado-inventario",
        },
        {
          icon: <BarChart size={20} />,
          label: "Materiales Stock Mínimo",
          path: "/informes/materiales-stock-minimo",
        },
        {
          icon: <FileText size={20} />,
          label: "Inventario por Sede/Área",
          path: "/informes/inventario-por-sede-area",
        },
        {
          icon: <FileText size={20} />,
          label: "Transferencias entre Sedes",
          path: "/informes/transferencias-sedes",
        },
        {
          icon: <FileText size={20} />,
          label: "Historial por Usuario",
          path: "/informes/historial-por-usuario",
        },
        {
          icon: <FileText size={20} />,
          label: "Materiales de Baja",
          path: "/informes/materiales-baja",
        },
      ],
    },
  ];

  return (
    <>
      <div className={`flex flex-col h-full overflow-hidden transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'} ${darkMode ? 'bg-gradient-to-b from-slate-900 to-slate-800 text-white' : 'bg-white text-gray-800'}`}>
        {/* Encabezado del sidebar */}
        <div className={`flex items-center justify-between p-4 ${darkMode ? 'border-slate-700' : 'border-gray-200'} border-b`}>
          {!collapsed && (
            <h2 className={`font-bold text-xl ${darkMode ? 'text-emerald-400' : ''}`}>BoxWare</h2>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`p-2 rounded-md ${darkMode ? 'hover:bg-slate-700 text-emerald-400' : 'hover:bg-gray-100'}`}
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Menú de navegación */}
        <div className="flex-1 overflow-y-auto py-2">
          {menuGroups.map((group, index) => (
            <div key={index} className="mb-1">
              {group.standalone ? (
                <a
                  href={group.path}
                  className={`flex items-center px-4 py-3 ${isActive(group.path) 
                    ? `${darkMode ? 'bg-emerald-700 text-white' : 'bg-blue-500 text-black'}` 
                    : `${darkMode ? 'hover:bg-slate-700 text-emerald-300 hover:text-emerald-200' : 'hover:bg-gray-400 text-black hover:text-blue-600'}`
                  } hover:pl-5 transition-all duration-300 rounded-md cursor-pointer font-medium ${darkMode ? 'bg-slate-800/60' : 'bg-white'}`}
                >
                  <div className="mr-3">{group.icon}</div>
                  {!collapsed && <span>{group.label}</span>}
                </a>
              ) : (
                <div className="mb-1">
                  {/* Cabecera del grupo */}
                  <div
                    onClick={() => !collapsed && toggleGroup(group.label)}
                    className={`flex items-center px-4 py-3 ${isGroupActive(group.items) 
                      ? `${darkMode ? 'bg-emerald-700 text-white' : 'bg-blue-500 text-black'}` 
                      : `${darkMode ? 'hover:bg-slate-700 text-emerald-300 hover:text-emerald-200' : 'hover:bg-gray-400 text-black hover:text-blue-600'}`
                    } hover:pl-5 transition-all duration-300 rounded-md cursor-pointer font-medium ${darkMode ? 'bg-slate-800/60' : 'bg-white'}`}
                  >
                    <div className="mr-3">{group.icon}</div>
                    {!collapsed && (
                      <>
                        <span className="flex-grow">{group.label}</span>
                        <ChevronRight
                          size={20}
                          className={`transition-transform duration-300 ${
                            expandedGroups.includes(group.label)
                              ? "rotate-90"
                              : ""
                          }`}
                        />
                      </>
                    )}
                  </div>

                  {/* Submenú con animación */}
                  <div
                    className={`pl-4 ${darkMode ? 'bg-slate-800/40' : 'bg-white'} transition-all duration-300 ease-in-out overflow-hidden ${expandedGroups.includes(group.label) ? "max-h-96" : "max-h-0"}`}
                  >
                    {group.items?.map((item, itemIndex) => (
                      <div key={itemIndex} className="w-full">
                        <Link to={item.path}
                          className={`flex items-center px-4 py-2 ${isActive(item.path) 
                            ? `${darkMode ? 'bg-emerald-700 text-white' : 'bg-blue-500 text-black'}` 
                            : `${darkMode ? 'hover:bg-slate-700 text-emerald-300 hover:text-emerald-200' : 'hover:bg-gray-400 text-black hover:text-blue-600'}`
                          } transition-colors duration-300 rounded-md cursor-pointer font-medium`}
                        >
                          <div className="mr-3">{item.icon}</div>
                          <span>{item.label}</span>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Botón de cerrar sesión */}
        <div className={`mt-auto border-t ${darkMode ? 'border-slate-700 bg-slate-800' : 'border-gray-300 bg-white'} transition-colors duration-300`}>
          <div className="px-3 py-3">
            <button
              onClick={confirmLogout}
              className={`flex items-center px-3 py-2 ${darkMode ? 'text-emerald-400 hover:text-emerald-300 hover:bg-slate-700' : 'text-black hover:text-blue-600 hover:bg-gray-400'} transition-colors duration-300 cursor-pointer w-full text-left rounded-md font-medium`}
            >
              <div className="mr-3">
                <LogOut size={20} />
              </div>
              {!collapsed && <span>Cerrar Sesión</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <Transition appear show={showLogoutDialog} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setShowLogoutDialog(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className={`w-full max-w-md transform overflow-hidden rounded-2xl ${darkMode ? 'bg-slate-800 text-white' : 'bg-white text-black'} p-6 text-left align-middle shadow-xl transition-all`}>
                  <Dialog.Title
                    as="h3"
                    className={`text-lg font-medium leading-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}
                  >
                    Cerrar Sesión
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                      ¿Estás seguro que deseas cerrar sesión?
                    </p>
                  </div>

                  <div className="mt-4 flex justify-end space-x-3">
                    <button
                      type="button"
                      className={`inline-flex justify-center rounded-md border ${darkMode ? 'border-gray-600 bg-gray-700 text-gray-200 hover:bg-gray-600' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'} px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2`}
                      onClick={() => setShowLogoutDialog(false)}
                    >
                      No
                    </button>
                    <button
                      type="button"
                      className={`inline-flex justify-center rounded-md ${darkMode ? 'bg-emerald-600 text-white hover:bg-emerald-500' : 'bg-blue-500 text-white hover:bg-blue-400'} px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2`}
                      onClick={() => {
                        setShowLogoutDialog(false);
                        handleLogout();
                      }}
                    >
                      Sí
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default Sidebar;
