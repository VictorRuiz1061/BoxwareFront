import { useCallback, useEffect, useState } from 'react';
import { Rol } from '../types/rol';
import { getRoles, crearRol, actualizarRol, eliminarRol } from '../api/rolesApi';

export function useRoles() {
  const [roles, setRoles] = useState<Rol[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string> | null>(null);

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRoles();
      setRoles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al cargar los roles:', err);
      setError('Error al cargar los roles');
      setRoles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const crear = async (rol: Omit<Rol, 'id_rol'>) => {
    try {
      setValidationErrors(null);
      await crearRol(rol);
      await fetchRoles();
      return { success: true };
    } catch (error) {
      console.error('Error al crear rol:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      return { success: false, errors: { general: 'Error al crear el rol' } };
    }
  };

  const actualizar = async (id: number, rol: Partial<Rol>) => {
    try {
      setValidationErrors(null);
      await actualizarRol(id, rol);
      await fetchRoles();
      return { success: true };
    } catch (error) {
      console.error('Error al actualizar rol:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      return { success: false, errors: { general: 'Error al actualizar el rol' } };
    }
  };

  const eliminar = async (id: number) => {
    try {
      await eliminarRol(id);
      setRoles((prev) => prev.filter((r) => r.id_rol !== id));
      return { success: true };
    } catch (error) {
      console.error('Error al eliminar rol:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      return { success: false, errors: { general: 'Error al eliminar el rol' } };
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
    roles,
    loading,
    error,
    validationErrors,
    mostrarErrores,
    crearRol: crear,
    actualizarRol: actualizar,
    eliminarRol: eliminar,
    fetchRoles,
  };
}
