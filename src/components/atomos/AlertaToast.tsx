import { useState, useEffect } from 'react';
import { X, AlertTriangle, Info, AlertCircle, Check } from 'lucide-react';
import { Alerta, NivelAlerta } from '@/types/alerta';
import { useTheme } from '@/context/ThemeContext';
import AnimatedContainer from './AnimatedContainer';

interface AlertaToastProps {
  alerta: Alerta;
  onClose: () => void;
  onMarcarLeida: (alertaId: number) => void;
  duration?: number;
}

const AlertaToast = ({ alerta, onClose, onMarcarLeida, duration = 5000 }: AlertaToastProps) => {
  const { darkMode } = useTheme();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Esperar a que termine la animación
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleMarcarLeida = () => {
    onMarcarLeida(alerta.id_alerta);
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const getIconoAlerta = (nivel: NivelAlerta) => {
    switch (nivel) {
      case NivelAlerta.ERROR:
      case NivelAlerta.CRITICAL:
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case NivelAlerta.WARNING:
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case NivelAlerta.INFO:
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getColorAlerta = (nivel: NivelAlerta) => {
    switch (nivel) {
      case NivelAlerta.ERROR:
      case NivelAlerta.CRITICAL:
        return "border-l-red-500 bg-red-50 dark:bg-red-900/20";
      case NivelAlerta.WARNING:
        return "border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20";
      case NivelAlerta.INFO:
      default:
        return "border-l-blue-500 bg-blue-50 dark:bg-blue-900/20";
    }
  };

  return (
    <AnimatedContainer
      animation="slideFromRight"
      duration={300}
      className={`w-80 max-w-sm mb-4 rounded-lg shadow-lg border-l-4 ${getColorAlerta(alerta.nivel)} ${
        darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
      } transition-all duration-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
    >
      <div className="p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-0.5">
            {getIconoAlerta(alerta.nivel)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className={`text-sm font-medium ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {alerta.titulo}
              </p>
              
              <div className="flex items-center space-x-1">
                <button
                  onClick={handleMarcarLeida}
                  className={`p-1 rounded-full ${
                    darkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'
                  } transition-colors duration-200`}
                  title="Marcar como leída"
                >
                  <Check size={14} className="text-green-500" />
                </button>
                
                <button
                  onClick={() => {
                    setIsVisible(false);
                    setTimeout(onClose, 300);
                  }}
                  className={`p-1 rounded-full ${
                    darkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'
                  } transition-colors duration-200`}
                  title="Cerrar"
                >
                  <X size={14} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                </button>
              </div>
            </div>
            
            <p className={`text-sm mt-1 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {alerta.mensaje}
            </p>
          </div>
        </div>
      </div>
    </AnimatedContainer>
  );
};

export default AlertaToast; 