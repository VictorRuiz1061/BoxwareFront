import { useState, Fragment, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, Users, Shield, Key, Box, Package, Boxes, RefreshCw, RotateCw,
Building, Landmark, MapPin, Layout, Map, MapPinned, BookOpen, GraduationCap, Menu, LogOut,
ChevronRight, BarChart, FileText, PieChart, TrendingUp, Settings } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { Dialog, Transition } from "@headlessui/react";
import { useUserModulePermissions } from "@/hooks/permisos/useUserModulePermissions";
import { useAuth } from "@/hooks/auth";

// Define types for menu items
type MenuItem = {
  icon: JSX.Element;
  label: string;
  path?: string;
  items?: MenuItem[];
  standalone?: boolean;
};

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const { permittedModules, loading } = useUserModulePermissions();
  const { logoutUser } = useAuth();

  // Handle navigation more robustly - this is the key function for navigation
  const handleNavigation = (path: string) => {
    if (!path) return;
    
    // Ensure path starts with /
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    
    // Use navigate with replace: true to replace the current entry in the history stack
    navigate(normalizedPath, { replace: true });
  };

  // Handle logout
  const confirmLogout = () => {
    setShowLogoutDialog(true);
  };

  const handleLogout = () => {
    logoutUser();
  };

  // Check if a path is active
  const checkActive = (path: string): boolean => {
    if (!path) return false;
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return location.pathname === normalizedPath;
  };

  // Check if any item in a group is active
  const isGroupActive = (items: MenuItem[] | undefined): boolean => {
    if (!items) return false;
    return items.some(item => {
      if (!item.path) return false;
      const normalizedPath = item.path.startsWith('/') ? item.path : `/${item.path}`;
      return location.pathname === normalizedPath;
    });
  };

  // Toggle group expansion
  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev =>
      prev.includes(groupName)
        ? prev.filter(g => g !== groupName)
        : [...prev, groupName]
    );
  };

  // Get icon component based on icon name
  const getIconComponent = (moduloImagen: string) => {
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

    if (moduloImagen && iconMap[moduloImagen.toLowerCase()]) {
      return iconMap[moduloImagen.toLowerCase()];
    }
    return <Settings size={20} />;
  };

  // Memoize menu items to prevent unnecessary recalculations
  const menuItems = useMemo(() => {
    // Default menu item (always present)
    const defaultItems: MenuItem[] = [
      {
        icon: <Home size={20} />,
        path: "/dashboard",
        label: "Inicio",
        standalone: true,
      }
    ];

    // If loading or no modules, return just the default items
    if (loading || !permittedModules || !Array.isArray(permittedModules) || permittedModules.length === 0) {
      return defaultItems;
    }

    // Filter main modules and submodules
    const modulosPrincipales = permittedModules.filter(m => !m.es_submenu && m.estado);
    const submodulos = permittedModules.filter(m => m.es_submenu && m.estado);

    // Build menu items from modules
    const items = [...defaultItems];

    modulosPrincipales.forEach(modulo => {
      const moduloItems = submodulos
        .filter(sub => sub.modulo_padre_id === modulo.id_modulo)
        .map(sub => ({
          icon: getIconComponent(sub.imagen || 'settings'),
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

      items.push(menuItem);
    });

    return items;
  }, [permittedModules, loading]);

  return (
    <>
      <div className={`flex flex-col h-full overflow-hidden transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'} ${darkMode ? 'bg-gradient-to-b from-slate-900 to-slate-800 text-white' : 'bg-white text-gray-800'}`}>
        {/* Sidebar header */}
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

        {/* Navigation menu */}
        <div className="flex-1 overflow-y-auto py-2">
          <nav className="px-2">
            <ul className="space-y-1">
              {menuItems.map((group, index) => {
                const isActiveItem = group.standalone && checkActive(group.path || "");
                const isActive = group.standalone
                  ? isActiveItem
                  : isGroupActive(group.items);
                const isExpanded = expandedGroups.includes(group.label);

                return (
                  <li key={index} className="mb-1">
                    {group.standalone ? (
                      // For standalone items, use a button instead of Link to have full control
                      <button
                        onClick={() => handleNavigation(group.path || "")}
                        className={`flex items-center w-full px-3 py-2 text-left ${isActiveItem
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
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => toggleGroup(group.label)}
                          className={`flex items-center justify-between w-full px-3 py-2 ${isActive
                            ? darkMode
                              ? "bg-slate-700 text-emerald-400"
                              : "bg-gray-200 text-blue-600"
                            : darkMode
                              ? "text-white hover:text-emerald-400 hover:bg-slate-700"
                              : "text-black hover:text-blue-600 hover:bg-gray-200"
                            } transition-colors duration-300 cursor-pointer rounded-md font-medium`}
                        >
                          <div className="flex items-center">
                            <div className="mr-3">{group.icon}</div>
                            {!collapsed && <span>{group.label}</span>}
                          </div>
                          {!collapsed && (
                            <ChevronRight
                              size={16}
                              className={`transform transition-transform duration-200 ${isExpanded ? "rotate-90" : ""
                                }`}
                            />
                          )}
                        </button>
                        {!collapsed && isExpanded && group.items && (
                          <ul className="mt-1 ml-6 space-y-1">
                            {group.items.map((item, itemIndex) => (
                              <li key={itemIndex}>
                                {/* For submenu items, use a button instead of Link */}
                                <button
                                  onClick={() => handleNavigation(item.path || "")}
                                  className={`flex items-center w-full px-3 py-2 text-left ${checkActive(item.path || "")
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
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Logout button */}
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