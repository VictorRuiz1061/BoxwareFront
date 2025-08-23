import { useState, useEffect } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { getNotificacionesPendientes, Notificacion, marcarNotificacionComoLeida } from '@/api/notificaciones';

export const useNotificaciones = () => {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [count, setCount] = useState(0);
  const { authState } = useAuthContext();

  const fetchNotificaciones = async () => {
    // Verificar si el usuario está autenticado
    if (!authState.isAuthenticated || !authState.user) return;
    
    // Obtener el ID del usuario de forma segura
    const userId = typeof authState.user === 'object' && authState.user !== null
      ? (authState.user as any).id_usuario || (authState.user as any).id
      : null;
      
    if (!userId) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await getNotificacionesPendientes(userId);
      setNotificaciones(response.data);
      setCount(response.count);
    } catch (err) {
      setError('Error al cargar notificaciones');
    } finally {
      setLoading(false);
    }
  };

  const marcarComoLeida = async (id: number) => {
    try {
      await marcarNotificacionComoLeida(id);
      // Actualizar el estado local
      setNotificaciones(prev => prev.filter(n => n.id_notificacion !== id));
      setCount(prev => prev - 1);
    } catch (err) {
    }
  };

  // Cargar notificaciones al montar el componente y cuando cambie el usuario
  useEffect(() => {
    if (authState.isAuthenticated && authState.user) {
      fetchNotificaciones();
    }
  }, [authState.isAuthenticated, authState.user]);
  
  // Actualizar las notificaciones cada 30 segundos
  useEffect(() => {
    if (authState.isAuthenticated && authState.user) {
      const interval = setInterval(() => {
        fetchNotificaciones();
      }, 30000); // 30 segundos
      
      return () => clearInterval(interval);
    }
  }, [authState.isAuthenticated, authState.user]);

  // Función para recargar notificaciones manualmente
  const recargarNotificaciones = () => {
    fetchNotificaciones();
  };

  return { 
    notificaciones, 
    loading, 
    error, 
    count,
    marcarComoLeida,
    recargarNotificaciones
  };
};
