import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { AnimatedContainer } from "@/components/atomos";
import { Settings } from "lucide-react";

const PaginaInicio = () => {
  const { darkMode } = useTheme();

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      <AnimatedContainer animation="fadeIn" duration={800}>
        <div className={`max-w-2xl mx-auto text-center ${darkMode ? 'bg-gray-800' : 'bg-white'} p-8 rounded-xl shadow-xl`}>
          <div className="flex justify-center mb-6">
            <div className={`p-4 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <Settings size={48} className={`${darkMode ? 'text-blue-400' : 'text-blue-500'} animate-spin-slow`} />
            </div>
          </div>
          
          <h1 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
            Panel en Mantenimiento
          </h1>
          
          <p className={`text-lg mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Estamos trabajando en mejorar tu experiencia. Esta sección estará disponible próximamente.
          </p>
          
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
            <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
            En desarrollo
          </div>
        </div>
      </AnimatedContainer>
    </div>
  );
};

export default React.memo(PaginaInicio);

// Agregar al archivo tailwind.config.js:
// animation: {
//   'spin-slow': 'spin 3s linear infinite',
// }
