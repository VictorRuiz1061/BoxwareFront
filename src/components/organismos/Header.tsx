import { Bell, User, Settings } from 'lucide-react';

const Header = ({ userName = "Usuario" }) => {
  return (
    <header className="bg-white shadow-lg h-16 relative z-10">
      <div className="flex items-center justify-end h-full px-6 bg-gradient-to-r from-amber-600 to-orange-700">
        {/* Zona de usuario */}
        <div className="flex items-center space-x-6">
          {/* Notificaciones */}
          <button className="relative p-2 text-white hover:bg-amber-500 rounded-lg transition-all duration-300 group">
            <Bell size={20} className="group-hover:scale-110 transition-transform duration-300" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110">
              3
            </span>
          </button>

          {/* Configuración */}
          <a
            href="/settings"
            className="p-2 text-white hover:bg-amber-500 rounded-lg transition-all duration-300 group"
            title="Configuración"
          >
            <Settings size={20} className="group-hover:scale-110 transition-transform duration-300" />
          </a>

          {/* Separador */}
          <div className="h-8 w-px bg-amber-500/50"></div>

          {/* Perfil de usuario */}
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center text-white shadow-md transition-all duration-300 group-hover:bg-amber-400">
              <User size={20} className="group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-white text-sm font-medium">{userName}</span>
              <span className="text-amber-200 text-xs">Administrador</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;