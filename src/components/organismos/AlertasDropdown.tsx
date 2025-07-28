import { useRef, useEffect } from "react";
import { Bell, X, Check, AlertTriangle, Info, AlertCircle, Clock } from "lucide-react";
import { useGetAlertas } from "@/hooks/alertas";
import { usePatchAlertaLeer } from "@/hooks/alertas";
import { useTheme } from "@/context/ThemeContext";
import { Alerta, NivelAlerta, EstadoAlerta } from "@/types/alerta";
import AnimatedContainer from "@/components/atomos/AnimatedContainer";

interface AlertasDropdownProps {
  isOpen: boolean;
  onToggle: () => void;
}

const AlertasDropdown = ({ isOpen, onToggle }: AlertasDropdownProps) => {
  const { darkMode } = useTheme();
  const { alertas, loading } = useGetAlertas();
  const { actualizarAlerta } = usePatchAlertaLeer();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filtrar alertas no leídas para el contador
  const alertasNoLeidas = alertas.filter(alerta => alerta.estado === EstadoAlerta.PENDIENTE);
  const alertasRecientes = alertas.slice(0, 5); // Mostrar solo las 5 más recientes

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onToggle();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onToggle]);

  // Función para marcar alerta como leída
  const handleMarcarLeida = async (alerta: Alerta) => {
    try {
      await actualizarAlerta(alerta.id_alerta);
    } catch (error) {
    }
  };

  // Función para obtener el icono según el nivel de alerta
  const getIconoAlerta = (nivel: NivelAlerta) => {
    switch (nivel) {
      case NivelAlerta.ERROR:
      case NivelAlerta.CRITICAL:
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case NivelAlerta.WARNING:
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case NivelAlerta.INFO:
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  // Función para obtener el color según el nivel de alerta
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

  // Función para formatear la fecha
  const formatearFecha = (fecha: string) => {
    const ahora = new Date();
    const fechaAlerta = new Date(fecha);
    const diferencia = ahora.getTime() - fechaAlerta.getTime();
    const minutos = Math.floor(diferencia / (1000 * 60));
    const horas = Math.floor(diferencia / (1000 * 60 * 60));
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));

    if (minutos < 60) {
      return `Hace ${minutos} min`;
    } else if (horas < 24) {
      return `Hace ${horas} h`;
    } else {
      return `Hace ${dias} días`;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botón de notificaciones */}
      <button
        onClick={onToggle}
        className={`relative p-2 text-white ${
          darkMode ? 'hover:bg-slate-700' : 'hover:bg-blue-500'
        } rounded-lg transition-all duration-300 group`}
      >
        <Bell size={20} className="group-hover:scale-110 transition-transform duration-300" />
        {alertasNoLeidas.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110 animate-pulse">
            {alertasNoLeidas.length > 9 ? '9+' : alertasNoLeidas.length}
          </span>
        )}
      </button>

      {/* Dropdown de alertas */}
      {isOpen && (
        <AnimatedContainer
          animation="slideDown"
          duration={300}
          className={`absolute right-0 mt-2 w-80 max-h-96 overflow-hidden rounded-lg shadow-xl border ${
            darkMode 
              ? 'bg-slate-800 border-slate-700' 
              : 'bg-white border-gray-200'
          } z-50`}
        >
          {/* Header del dropdown */}
          <div className={`p-4 border-b ${
            darkMode ? 'border-slate-700' : 'border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <h3 className={`font-semibold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Notificaciones
              </h3>
              <button
                onClick={onToggle}
                className={`p-1 rounded-full ${
                  darkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'
                } transition-colors duration-200`}
              >
                <X size={16} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
              </button>
            </div>
            {alertasNoLeidas.length > 0 && (
              <p className={`text-sm mt-1 ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {alertasNoLeidas.length} sin leer
              </p>
            )}
          </div>

          {/* Lista de alertas */}
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                <p className={`text-sm mt-2 ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Cargando alertas...
                </p>
              </div>
            ) : alertasRecientes.length === 0 ? (
              <div className="p-6 text-center">
                <Bell className={`w-8 h-8 mx-auto mb-2 ${
                  darkMode ? 'text-gray-500' : 'text-gray-400'
                }`} />
                <p className={`text-sm ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  No hay notificaciones
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-slate-700">
                {alertasRecientes.map((alerta) => (
                  <div
                    key={alerta.id_alerta}
                    className={`p-4 border-l-4 transition-all duration-200 hover:shadow-md ${
                      getColorAlerta(alerta.nivel)
                    } ${
                      alerta.estado === EstadoAlerta.LEIDA 
                        ? 'opacity-60' 
                        : ''
                    }`}
                  >
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
                          
                          {alerta.estado === EstadoAlerta.PENDIENTE && (
                            <button
                              onClick={() => handleMarcarLeida(alerta)}
                              className={`p-1 rounded-full ${
                                darkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'
                              } transition-colors duration-200`}
                              title="Marcar como leída"
                            >
                              <Check size={14} className="text-green-500" />
                            </button>
                          )}
                        </div>
                        
                        <p className={`text-sm mt-1 ${
                          darkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {alerta.mensaje}
                        </p>
                        
                        <div className="flex items-center mt-2 space-x-2">
                          <Clock size={12} className={
                            darkMode ? 'text-gray-500' : 'text-gray-400'
                          } />
                          <span className={`text-xs ${
                            darkMode ? 'text-gray-500' : 'text-gray-400'
                          }`}>
                            {formatearFecha(alerta.fecha_creacion)}
                          </span>
                          
                          {alerta.estado === EstadoAlerta.PENDIENTE && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                              Nuevo
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer del dropdown */}
          {alertas.length > 5 && (
            <div className={`p-3 border-t ${
              darkMode ? 'border-slate-700 bg-slate-800' : 'border-gray-200 bg-gray-50'
            }`}>
              <button
                className={`w-full text-sm font-medium ${
                  darkMode 
                    ? 'text-blue-400 hover:text-blue-300' 
                    : 'text-blue-600 hover:text-blue-500'
                } transition-colors duration-200`}
              >
                Ver todas las notificaciones ({alertas.length})
              </button>
            </div>
          )}
        </AnimatedContainer>
      )}
    </div>
  );
};

export default AlertasDropdown; 