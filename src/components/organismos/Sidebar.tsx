import { useState, Fragment, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Home, Users, Shield, Key, Box, Package, Boxes, RefreshCw, RotateCw,
  Building, Landmark, MapPin, Layout, Map, MapPinned, BookOpen,
  GraduationCap, Menu, LogOut, ChevronRight, BarChart, FileText,
  PieChart, TrendingUp, Settings
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { Dialog, Transition } from "@headlessui/react";
import { useUserModulePermissions } from "@/hooks/permisos/useUserModulePermissions";
import { useAuth } from "@/hooks/auth";

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

  console.log("Sidebar: permittedModules", permittedModules);
  console.log("Sidebar: loading", loading);

  /** ==== UTILS ==== */
  const handleNavigation = (path?: string) => {
    if (path) navigate(path.startsWith("/") ? path : `/${path}`, { replace: true });
  };

  const isActivePath = (path?: string) =>
    path ? location.pathname === (path.startsWith("/") ? path : `/${path}`) : false;

  const isGroupActive = (items?: MenuItem[]) =>
    items?.some(item => isActivePath(item.path)) || false;

  const toggleGroup = (label: string) =>
    setExpandedGroups(prev =>
      prev.includes(label) ? prev.filter(g => g !== label) : [...prev, label]
    );

  const iconMap: Record<string, JSX.Element> = {
    home: <Home size={20} />, users: <Users size={20} />, shield: <Shield size={20} />,
    key: <Key size={20} />, box: <Box size={20} />, package: <Package size={20} />,
    boxes: <Boxes size={20} />, "refresh-cw": <RefreshCw size={20} />, "rotate-cw": <RotateCw size={20} />,
    building: <Building size={20} />, landmark: <Landmark size={20} />, "map-pin": <MapPin size={20} />,
    layout: <Layout size={20} />, map: <Map size={20} />, "map-pinned": <MapPinned size={20} />,
    "book-open": <BookOpen size={20} />, "graduation-cap": <GraduationCap size={20} />,
    "bar-chart": <BarChart size={20} />, "file-text": <FileText size={20} />,
    "pie-chart": <PieChart size={20} />, "trending-up": <TrendingUp size={20} />,
    settings: <Settings size={20} />
  };

  const getIcon = (name?: string) =>
    iconMap[name?.toLowerCase() || "settings"] || <Settings size={20} />;

  /** ==== MENU ==== */
  const menuItems = useMemo(() => {
    const defaultItems: MenuItem[] = [
      { icon: <Home size={20} />, path: "/dashboard", label: "Inicio", standalone: true }
    ];

    if (loading || !Array.isArray(permittedModules) || permittedModules.length === 0) {
      console.log("Sidebar: menuItems - Loading or no permittedModules.");
      return defaultItems;
    }

    const mainModules = permittedModules.filter(m => !m.es_submenu && m.estado);
    const subModules = permittedModules.filter(m => m.es_submenu && m.estado);

    console.log("Sidebar: menuItems - mainModules", mainModules);
    console.log("Sidebar: menuItems - subModules", subModules);

    return [
      ...defaultItems,
      ...mainModules.map(mod => {
        const children = subModules
          .filter(sub => sub.modulo_padre_id === mod.id_modulo)
          .map(sub => ({
            icon: getIcon(sub.imagen),
            label: sub.descripcion_ruta,
            path: sub.rutas
          }));

        return {
          icon: getIcon(mod.imagen),
          label: mod.descripcion_ruta,
          items: children.length ? children : undefined,
          path: children.length ? undefined : mod.rutas,
          standalone: !children.length
        };
      })
    ];
  }, [permittedModules, loading]);

  console.log("Sidebar: Final menuItems", menuItems);

  return (
    <>
      <div className={`flex flex-col h-full transition-all duration-300 ${collapsed ? "w-16" : "w-64"} 
        ${darkMode ? "bg-gradient-to-b from-slate-900 to-slate-800 text-white" : "bg-white text-gray-800"}`}>
        
        {/* HEADER */}
        <div className={`flex items-center justify-between p-4 border-b ${darkMode ? "border-slate-700" : "border-gray-200"}`}>
          {!collapsed && <h2 className={`font-bold text-xl ${darkMode && "text-emerald-400"}`}>BoxWare</h2>}
          <button onClick={() => setCollapsed(!collapsed)}
            className={`p-2 rounded-md ${darkMode ? "hover:bg-slate-700 text-emerald-400" : "hover:bg-gray-100"}`}>
            <Menu size={20} />
          </button>
        </div>

        {/* MENU */}
        <div className="flex-1 overflow-y-auto py-2 px-2">
          <ul className="space-y-1">
            {menuItems.map((group, idx) => {
              const active = group.standalone ? isActivePath(group.path) : isGroupActive(group.items);
              const expanded = expandedGroups.includes(group.label);

              return (
                <li key={idx}>
                  {group.standalone ? (
                    <button
                      onClick={() => handleNavigation(group.path)}
                      className={`flex items-center w-full px-3 py-2 rounded-md font-medium transition-colors
                        ${active
                          ? darkMode ? "bg-slate-700 text-emerald-400" : "bg-gray-200 text-blue-600"
                          : darkMode ? "hover:bg-slate-700 hover:text-emerald-400" : "hover:bg-gray-200 hover:text-blue-600"
                        }`}>
                      <div className="mr-3">{group.icon}</div>
                      {!collapsed && group.label}
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => toggleGroup(group.label)}
                        className={`flex items-center justify-between w-full px-3 py-2 rounded-md font-medium transition-colors
                          ${active
                            ? darkMode ? "bg-slate-700 text-emerald-400" : "bg-gray-200 text-blue-600"
                            : darkMode ? "hover:bg-slate-700 hover:text-emerald-400" : "hover:bg-gray-200 hover:text-blue-600"
                          }`}>
                        <div className="flex items-center">
                          <div className="mr-3">{group.icon}</div>
                          {!collapsed && group.label}
                        </div>
                        {!collapsed && (
                          <ChevronRight size={16}
                            className={`transform transition-transform ${expanded ? "rotate-90" : ""}`} />
                        )}
                      </button>
                      {!collapsed && expanded && group.items && (
                        <ul className="mt-1 ml-6 space-y-1">
                          {group.items.map((item, i) => (
                            <li key={i}>
                              <button
                                onClick={() => handleNavigation(item.path)}
                                className={`flex items-center w-full px-3 py-2 rounded-md transition-colors
                                  ${isActivePath(item.path)
                                    ? darkMode ? "bg-slate-700 text-emerald-400" : "bg-gray-200 text-blue-600"
                                    : darkMode ? "hover:bg-slate-700 hover:text-emerald-400" : "hover:bg-gray-200 hover:text-blue-600"
                                  }`}>
                                <div className="mr-3">{item.icon}</div>
                                {item.label}
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
        </div>

        {/* LOGOUT */}
        <div className={`mt-auto border-t ${darkMode ? "border-slate-700 bg-slate-800" : "border-gray-300 bg-white"}`}>
          <div className="px-3 py-3">
            <button
              onClick={() => setShowLogoutDialog(true)}
              className={`flex items-center w-full px-3 py-2 rounded-md font-medium transition-colors
                ${darkMode ? "text-emerald-400 hover:bg-slate-700" : "text-black hover:bg-gray-400"}`}>
              <LogOut size={20} className="mr-3" />
              {!collapsed && "Cerrar Sesión"}
            </button>
          </div>
        </div>
      </div>

      {/* LOGOUT MODAL */}
      <Transition appear show={showLogoutDialog} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setShowLogoutDialog(false)}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100"
            leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto flex items-center justify-center p-4">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100" leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <Dialog.Panel className={`w-full max-w-md rounded-2xl p-6 shadow-xl transition-all
                ${darkMode ? "bg-slate-800 text-white" : "bg-white text-black"}`}>
                <Dialog.Title className="text-lg font-medium">Cerrar Sesión</Dialog.Title>
                <p className={`mt-2 text-sm ${darkMode ? "text-gray-300" : "text-gray-500"}`}>
                  ¿Estás seguro que deseas cerrar sesión?
                </p>
                <div className="mt-4 flex justify-end gap-3">
                  <button
                    className={`px-4 py-2 text-sm rounded-md border
                      ${darkMode
                        ? "border-gray-600 bg-gray-700 text-gray-200 hover:bg-gray-600"
                        : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"}`}
                    onClick={() => setShowLogoutDialog(false)}>
                    No
                  </button>
                  <button
                    className={`px-4 py-2 text-sm rounded-md
                      ${darkMode
                        ? "bg-emerald-600 text-white hover:bg-emerald-500"
                        : "bg-blue-500 text-white hover:bg-blue-400"}`}
                    onClick={() => { setShowLogoutDialog(false); logoutUser(); }}>
                    Sí
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default Sidebar;
