import { useState, Fragment, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Home, Users, Shield, Key, Box, Package, Boxes, RefreshCw, RotateCw,
  Building, Landmark, MapPin, Layout, Map, MapPinned, BookOpen, GraduationCap, Menu, LogOut,
  ChevronRight, BarChart, FileText, PieChart, TrendingUp, Settings } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { Dialog, Transition } from "@headlessui/react";
import { useGetModulos } from "@/hooks/modulos";
import { useAuth } from "@/hooks/auth";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  // navigate ya no es necesario aquí porque usamos el hook useLogoutAuth
  const location = useLocation();
  const { darkMode } = useTheme();
  const { modulos, loading } = useGetModulos();

  // Definir un tipo para los elementos del menú
  type MenuItem = {
    icon: JSX.Element;
    label: string;
    path?: string;
    items?: MenuItem[];
    standalone?: boolean;
  };
  
  const [dynamicMenuGroups, setDynamicMenuGroups] = useState<MenuItem[]>([]);

  // Usar el hook de logout para asegurar que se limpien todas las credenciales
  const { logoutUser } = useAuth();
  
  const handleLogout = () => {
    logoutUser();
  };

  const confirmLogout = () => {
    setShowLogoutDialog(true);
  };

  // Función para verificar si un elemento está activo
  const checkActive = (path: string): boolean => {
    return location.pathname === path;
  };

  // Función para verificar si algún elemento de un grupo está activo
  const isGroupActive = (items: MenuItem[] | undefined): boolean => {
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

  // Función para obtener el ícono según la URL de la imagen
  const getIconComponent = (moduloImagen: string) => {
    // Mapeo de nombres de iconos a componentes
    const iconMap: Record<string, JSX.Element> = {
      'home': <Home size={20} />,
      'users': <Users size={20} />,
      'shield': <Shield size={20} />,
      'key': <Key size={20} />,
      'box': <Box size={20} />,
      'package': <Package size={20} />,
      'boxes': <Boxes size={20} />,
      'refresh-cw': <RefreshCw size={20} />,
      'rotate-cw': <RotateCw size={20} />,
      'building': <Building size={20} />,
      'landmark': <Landmark size={20} />,
      'map-pin': <MapPin size={20} />,
      'layout': <Layout size={20} />,
      'map': <Map size={20} />,
      'map-pinned': <MapPinned size={20} />,
      'book-open': <BookOpen size={20} />,
      'graduation-cap': <GraduationCap size={20} />,
      'bar-chart': <BarChart size={20} />,
      'file-text': <FileText size={20} />,
      'pie-chart': <PieChart size={20} />,
      'trending-up': <TrendingUp size={20} />,
      'settings': <Settings size={20} />
    };
    
    // Si la imagen coincide con un nombre de icono, devolver el componente
    if (moduloImagen && iconMap[moduloImagen.toLowerCase()]) {
      return iconMap[moduloImagen.toLowerCase()];
    }
    
    // Icono por defecto
    return <Settings size={20} />;
  };
  
  // Función para organizar los módulos en estructura jerárquica
  const organizarModulos = (): MenuItem[] => {
    // Verificar que modulos sea un array
    if (!modulos || !Array.isArray(modulos) || modulos.length === 0) {
      return [];
    }
    
    // Primero, separamos los módulos principales y los submódulos
    const modulosPrincipales = modulos.filter(m => !m.es_submenu && m.estado);
    const submodulos = modulos.filter(m => m.es_submenu && m.estado);
    
    // Creamos la estructura para el menú
    const menuItems: MenuItem[] = [
      {
        icon: <Home size={20} />,
        label: "Inicio",
        path: "/dashboard",
        standalone: true,
      }
    ];
    
    // Agregamos los módulos principales con sus submódulos
    modulosPrincipales.forEach(modulo => {
      const moduloItems = submodulos
        .filter(sub => sub.modulo_padre_id === modulo.id_modulo)
        .map(sub => ({
          icon: getIconComponent(sub.imagen),
          label: sub.descripcion_ruta,
          path: sub.rutas,
        }));
      
      const menuItem: MenuItem = {
        icon: getIconComponent(modulo.imagen),
        label: modulo.descripcion_ruta,
        items: moduloItems.length > 0 ? moduloItems : undefined,
        path: moduloItems.length === 0 ? modulo.rutas : undefined,
        standalone: moduloItems.length === 0
      };
      
      menuItems.push(menuItem);
    });
    
    return menuItems;
  };
  
  // Actualizar el menú cuando cambien los módulos
  useEffect(() => {
    if (!loading) {
      const menuItems = organizarModulos();
      setDynamicMenuGroups(menuItems);
    }
  }, [modulos, loading]);
  
  // Menú estático de respaldo (se usa mientras se cargan los módulos)
  const staticMenuGroups: MenuItem[] = [
    {
      icon: <Home size={20} />,
      label: "Inicio",
      path: "/dashboard",
      standalone: true,
    },
    //       path: "/informes/movimientos-historicos",
    //     },
    //     {
    //       icon: <BarChart size={20} />,
    //       label: "Materiales Más Utilizados",
    //       path: "/informes/materiales-mas-utilizados",
    //     },
    //     {
    //       icon: <PieChart size={20} />,
    //       label: "Estado Inventario",
    //       path: "/informes/estado-inventario",
    //     },
    //     {
    //       icon: <BarChart size={20} />,
    //       label: "Materiales Stock Mínimo",
    //       path: "/informes/materiales-stock-minimo",
    //     },
    //     {
    //       icon: <FileText size={20} />,
    //       label: "Inventario por Sede/Área",
    //       path: "/informes/inventario-por-sede-area",
    //     },
    //     {
    //       icon: <FileText size={20} />,
    //       label: "Transferencias entre Sedes",
    //       path: "/informes/transferencias-sedes",
    //     },
    //     {
    //       icon: <FileText size={20} />,
    //       label: "Historial por Usuario",
    //       path: "/informes/historial-por-usuario",
    //     },
    //     {
    //       icon: <FileText size={20} />,
    //       label: "Materiales de Baja",
    //       path: "/informes/materiales-baja",
    //     },
    //   ],
    // },
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
          {(dynamicMenuGroups.length > 0 ? dynamicMenuGroups : staticMenuGroups).map((group, index) => {
            const isActiveItem = group.standalone
              ? checkActive(group.path || "")
              : isGroupActive(group.items as MenuItem[]);
            const isExpanded = expandedGroups.includes(group.label);

            return (
              <div key={index}>
                {group.standalone ? (
                  <Link
                    to={group.path || ""}
                    className={`flex items-center px-3 py-2 ${isActiveItem
                      ? darkMode
                        ? "bg-slate-700 text-emerald-400"
                        : "bg-gray-200 text-blue-600"
                      : darkMode
                        ? "text-white hover:text-emerald-400 hover:bg-slate-700"
                        : "text-black hover:text-blue-600 hover:bg-gray-200"
                      } transition-colors duration-300 cursor-pointer rounded-md font-medium`}
                  >
                    <div className="mr-3">{group.icon}</div>
                    {!collapsed && <span>{group.label}</span>}
                  </Link>
                ) : (
                  <>
                    <div
                      className={`flex items-center justify-between px-3 py-2 ${isActiveItem || isExpanded
                        ? darkMode
                          ? "bg-slate-700 text-emerald-400"
                          : "bg-gray-200 text-blue-600"
                        : darkMode
                          ? "text-white hover:text-emerald-400 hover:bg-slate-700"
                          : "text-black hover:text-blue-600 hover:bg-gray-200"
                        } transition-colors duration-300 cursor-pointer rounded-md font-medium`}
                      onClick={() => toggleGroup(group.label)}
                    >
                      <div className="flex items-center">
                        <div className="mr-3">{group.icon}</div>
                        {!collapsed && <span>{group.label}</span>}
                      </div>
                      {!collapsed && (
                        <ChevronRight
                          size={16}
                          className={`transform transition-transform ${isExpanded ? "rotate-90" : ""}`}
                        />
                      )}
                    </div>
                    {isExpanded && !collapsed && (
                      <div className="pl-4 mt-1 space-y-1">
                        {(group.items as MenuItem[])?.map((item: MenuItem, itemIndex: number) => (
                          <Link
                            key={itemIndex}
                            to={item.path || ""}
                            className={`flex items-center px-3 py-2 ${checkActive(item.path || "")
                              ? darkMode
                                ? "bg-slate-700 text-emerald-400"
                                : "bg-gray-200 text-blue-600"
                              : darkMode
                                ? "text-white hover:text-emerald-400 hover:bg-slate-700"
                                : "text-black hover:text-blue-600 hover:bg-gray-200"
                              } transition-colors duration-300 cursor-pointer rounded-md`}
                          >
                            <div className="mr-3">{item.icon}</div>
                            <span>{item.label}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
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
