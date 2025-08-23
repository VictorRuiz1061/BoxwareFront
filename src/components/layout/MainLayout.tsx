import { Outlet } from 'react-router-dom';
import Header from '../organismos/Header';
import Sidebar from '../organismos/Sidebar';
import { useTheme } from '../../context/ThemeContext';
import React from 'react';

const MainLayout: React.FC = () => {
  const { darkMode } = useTheme();

  return (
    <div
      className={`flex h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-800' }`} >
      {/* Sidebar fija a la izquierda */}
      <Sidebar />

      {/* Contenedor principal */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />

        <main
          role="main" className={`flex-1 overflow-y-auto p-4 transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-100' }`} >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default React.memo(MainLayout);
