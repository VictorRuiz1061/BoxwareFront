import { Bell, User, Settings } from "lucide-react"; 
import AnimatedContainer from "../atomos/AnimatedContainer";
import ThemeToggle from "../atomos/ThemeToggle";
import { useTheme } from "../../context/ThemeContext";

const Header = ({ userName = "Usuario" }) => { 
  const { darkMode } = useTheme();
 
  return (
    <AnimatedContainer animation="fadeIn" duration={400} className="w-full">
      <header className={`${darkMode ? 'bg-slate-900' : 'bg-white'} shadow-lg h-16 relative z-10 transition-colors duration-300`}>
        <div className={`flex items-center justify-end h-full px-6 ${darkMode ? 'bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700' : 'bg-gradient-to-r from-blue-900 via-blue-800 to-blue-600'} transition-colors duration-300`}>
          {/* Zona de usuario */}
          <div className="flex items-center space-x-6">
            {/* Theme Toggle */}
            <AnimatedContainer animation="slideUp" delay={50} duration={400}>
              <ThemeToggle />
            </AnimatedContainer>
            {/* Notificaciones */}
            <AnimatedContainer animation="slideUp" delay={100} duration={400}>
              <button className={`relative p-2 text-white ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-blue-500'} rounded-lg transition-all duration-300 group`}>
                <Bell
                  size={20}
                  className="group-hover:scale-110 transition-transform duration-300"
                />
                <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110">
                  3
                </span>
              </button>
            </AnimatedContainer>

            {/* Configuración */}
            <AnimatedContainer animation="slideUp" delay={200} duration={400}>
              <a
                href="/settings"
                className={`p-2 text-white ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-blue-500'} rounded-lg transition-all duration-300 group`}
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
              <div className={`h-8 w-px ${darkMode ? 'bg-emerald-300/30' : 'bg-blue-300/50'}`}></div>
            </AnimatedContainer>

            {/* Perfil de usuario */}
            <AnimatedContainer animation="slideUp" delay={400} duration={500}>
              <div className="flex items-center space-x-3 group cursor-pointer">
                <div className={`w-10 h-10 ${darkMode ? 'bg-emerald-600 group-hover:bg-emerald-500' : 'bg-blue-500 group-hover:bg-blue-400'} rounded-lg flex items-center justify-center text-white shadow-md transition-all duration-300`}>
                  <User
                    size={20}
                    className="group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-white text-sm font-medium">
                    {userName}
                  </span>
                  <span className={`text-xs ${darkMode ? 'text-emerald-200' : 'text-blue-200'}`}>Administrador</span>
                </div>
              </div>
            </AnimatedContainer>
          </div>
        </div>
      </header>
    </AnimatedContainer>
  );
};

export default Header