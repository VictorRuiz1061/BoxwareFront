import { useRef, useEffect } from 'react';
import { useNotificaciones } from '@/hooks/useNotificaciones';
import { useTheme } from '@/context/ThemeContext';
import { Bell, X, Check, AlertCircle } from 'lucide-react';

interface NotificacionesMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificacionesMenu = ({ isOpen, onClose }: NotificacionesMenuProps) => {
  const { notificaciones, loading, marcarComoLeida, count } = useNotificaciones();
  const { darkMode } = useTheme();
  const menuRef = useRef<HTMLDivElement>(null);

  // Cerrar el menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Obtener el color según el nivel de notificación
  const getNivelColor = (nivel: string) => {
    switch (nivel) {
      case 'info': return 'bg-blue-500';
      case 'warning': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      case 'critical': return 'bg-purple-600';
      default: return 'bg-blue-500';
    }
  };

  // Obtener el icono según el tipo de notificación
  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'stock_bajo':
      case 'material_nuevo':
      case 'movimiento_critico':
        return <AlertCircle size={16} />;
      default:
        return <Bell size={16} />;
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={menuRef}
      className={`absolute top-16 right-4 w-80 shadow-xl rounded-lg overflow-hidden z-50 transition-all duration-300 transform origin-top-right
        ${darkMode ? 'bg-slate-800 text-white' : 'bg-white text-gray-800'}`}
    >
      <div className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-medium">Notificaciones</h3>
        <button 
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      <div className="max-h-80 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center">Cargando notificaciones...</div>
        ) : notificaciones.length === 0 ? (
          <div className="p-4 text-center">No tienes notificaciones pendientes</div>
        ) : (
          <ul>
            {notificaciones.map((notificacion) => (
              <li 
                key={notificacion.id_notificacion}
                className={`p-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors relative`}
              >
                <div className="flex">
                  <div className={`${getNivelColor(notificacion.nivel)} h-10 w-10 rounded-full flex items-center justify-center text-white mr-3 flex-shrink-0`}>
                    {getTipoIcon(notificacion.tipo)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{notificacion.titulo}</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">{notificacion.mensaje}</p>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
                      {new Date(notificacion.fecha_creacion).toLocaleString()}
                    </span>
                  </div>
                  <button 
                    onClick={() => marcarComoLeida(notificacion.id_notificacion)}
                    className="ml-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    title="Marcar como leída"
                  >
                    <Check size={16} className="text-green-500" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {count > 0 && (
        <div className="p-2 text-center border-t border-gray-200 dark:border-gray-700">
          <button 
            onClick={() => notificaciones.forEach(n => marcarComoLeida(n.id_notificacion))}
            className={`text-sm px-4 py-2 rounded-md ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors`}
          >
            Marcar todas como leídas
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificacionesMenu;
