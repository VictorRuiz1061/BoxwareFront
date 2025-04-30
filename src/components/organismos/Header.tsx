import { Bell, User, Settings } from "lucide-react"; 
import AnimatedContainer from "../atomos/AnimatedContainer";

const Header = ({ userName = "Usuario" }) => { 
 
  return (
    <AnimatedContainer animation="fadeIn" duration={400} className="w-full">
      <header className="bg-white shadow-lg h-16 relative z-10">
        <div className="flex items-center justify-end h-full px-6 bg-gradient-to-r from-black via-blue-800 to-blue-600">
          {/* Zona de usuario */}
          <div className="flex items-center space-x-6">
            {/* Notificaciones */}
            <AnimatedContainer animation="slideUp" delay={100} duration={400}>
              <button className="relative p-2 text-white hover:bg-blue-500 rounded-lg transition-all duration-300 group">
                <Bell
                  size={20}
                  className="group-hover:scale-110 transition-transform duration-300"
                />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110">
                  3
                </span>
              </button>
            </AnimatedContainer>

            {/* Configuración */}
            <AnimatedContainer animation="slideUp" delay={200} duration={400}>
              <a
                href="/settings"
                className="p-2 text-white hover:bg-blue-500 rounded-lg transition-all duration-300 group"
                title="Configuración"
              >
                <Settings
                  size={20}
                  className="group-hover:scale-110 transition-transform duration-300"
                />
              </a>
            </AnimatedContainer>

            {/* Separador */}
            <AnimatedContainer animation="fadeIn" delay={300} duration={600}>
              <div className="h-8 w-px bg-blue-300/50"></div>
            </AnimatedContainer>

            {/* Perfil de usuario */}
            <AnimatedContainer animation="slideUp" delay={400} duration={500}>
              <div className="flex items-center space-x-3 group cursor-pointer">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white shadow-md transition-all duration-300 group-hover:bg-blue-400">
                  <User
                    size={20}
                    className="group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-white text-sm font-medium">
                    {userName}
                  </span>
                  <span className="text-blue-200 text-xs">Administrador</span>
                </div>
              </div>
            </AnimatedContainer>
          </div>
        </div>
      </header>
    </AnimatedContainer>
  );
};

export default Header;
