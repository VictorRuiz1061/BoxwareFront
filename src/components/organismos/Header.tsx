import { Bell, User, Settings } from 'lucide-react';

const Header = ({ userName = "Usuario" }) => {
  return (
    <header className="bg-white shadow-md h-16">
      <div className="flex items-center justify-between h-full px-6">
        {/* Búsqueda simple */}
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Buscar..."
            className="px-4 py-2 border rounded-md w-64"
          />
        </div>

        {/* Zona de usuario */}
        <div className="flex items-center space-x-4">
          {/* Notificaciones */}
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Bell size={20} />
            <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              3
            </span>
          </button>

          {/* Configuración */}
          <a
            href="/settings"
            className="p-2 rounded-full hover:bg-gray-100"
            title="Configuración"
          >
            <Settings size={20} />
          </a>

          {/* Perfil de usuario */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white">
              <User size={18} />
            </div>
            <span>{userName}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;