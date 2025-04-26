import { useCallback, useEffect, useState } from 'react';
import { Permiso } from '../types/permiso';
import { getPermisos, crearPermiso, actualizarPermiso, eliminarPermiso } from '../api/permisosApi';

export function usePermisos() {
  const [permisos, setPermisos] = useState<Permiso[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string> | null>(null);

  const fetchPermisos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPermisos();
      setPermisos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al cargar los permisos:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setPermisos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPermisos();
  }, [fetchPermisos]);

  const crear = async (permiso: Omit<Permiso, 'id_permiso'>) => {
    try {
      setValidationErrors(null);
      const permisoConId: Permiso = {
        ...permiso,
        id_permiso: 0
      };
      await crearPermiso(permisoConId);
      await fetchPermisos();
      return { success: true };
    } catch (error) {
      console.error('Error al crear permiso:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      return { success: false, errors: { general: 'Error al crear el permiso' } };
    }
  };

  const actualizar = async (id: number, permiso: Partial<Permiso>) => {
    try {
      setValidationErrors(null);
      await actualizarPermiso(id, permiso);
      await fetchPermisos();
      return { success: true };
    } catch (error) {
      console.error('Error al actualizar permiso:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      return { success: false, errors: { general: 'Error al actualizar el permiso' } };
    }
  };

  const eliminar = async (id: number) => {
    try {
      await eliminarPermiso(id);
      setPermisos((prev) => prev.filter((p) => p.id_permiso !== id));
      return { success: true };
    } catch (error) {
      console.error('Error al eliminar permiso:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      return { success: false, errors: { general: 'Error al eliminar el permiso' } };
    }
  };

  // Función auxiliar para mostrar mensajes de error
  const mostrarErrores = () => {
    if (!validationErrors) return null;
    
    let mensaje = 'Errores de validación:\n';
    Object.entries(validationErrors).forEach(([campo, error]) => {
      mensaje += `- ${campo}: ${error}\n`;
    });
    
    return mensaje;
  };

  return { 
    permisos, 
    loading, 
    error, 
    validationErrors,
    mostrarErrores,
    fetchPermisos, 
    crearPermiso: crear, 
    actualizarPermiso: actualizar, 
    eliminarPermiso: eliminar 
  };
}
