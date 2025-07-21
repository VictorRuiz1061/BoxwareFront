import React from "react";
import { AnimatedContainer } from "@/components/atomos";
import { AlertTriangle } from "lucide-react"; 

// Importación del contexto de tema
import { useTheme } from "@/context/ThemeContext";

const PaginaInicio = () => {
  const { darkMode } = useTheme();

  return (
    <AnimatedContainer>
    <div className={`p-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'} min-h-screen transition-colors duration-300`}>
      <div className="flex flex-col items-center justify-center h-screen">
        <AlertTriangle size={120} className={`${darkMode ? 'text-yellow-300' : 'text-yellow-500'} mb-6`} />
        <h1 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Fuera de Servicio
        </h1>
        <p className={`text-xl mb-6 text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Esta página se encuentra en mantenimiento.
        </p>
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg max-w-md text-center`}>
          <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
            Estamos trabajando para mejorar su experiencia. Por favor, vuelva más tarde.
          </p>
        </div>
      </div>
    </div>
    </AnimatedContainer>
  );
};

export default React.memo(PaginaInicio);
