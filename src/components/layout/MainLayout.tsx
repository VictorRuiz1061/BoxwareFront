import { Outlet } from 'react-router-dom';
import Header from '../organismos/Header';
import Sidebar from '../organismos/Sidebar';
import { useTheme } from '../../context/ThemeContext';

const MainLayout = () => {
  const { darkMode } = useTheme();

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-800'} transition-colors duration-300`}>
        {/* Sidebar a la izquierda */}
        <Sidebar />
        
        {/* Contenido principal */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header />
          <main className={`flex-1 overflow-y-auto p-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} transition-colors duration-300`}>
            {/* Outlet renderiza el contenido de la ruta anidada */}
            <Outlet />
          </main>
        </div>
      </div>
  );
};

export default MainLayout;
