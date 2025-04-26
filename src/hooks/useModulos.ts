import { useCallback, useEffect, useState } from 'react';
import { Modulo } from '../types/modulo';
import { getModulos, crearModulo, actualizarModulo, eliminarModulo } from '../api/modulosApi';

export function useModulos() {
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string> | null>(null);

  const fetchModulos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getModulos();
      setModulos(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Error al cargar los módulos');
      setModulos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchModulos();
  }, [fetchModulos]);

  const crear = async (modulo: Omit<Modulo, 'id_modulo'>) => {
    try {
      setValidationErrors(null);
      await crearModulo(modulo);
      await fetchModulos();
      return { success: true };
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error desconocido');
      return { success: false, errors: { general: 'Error al crear el módulo' } };
    }
  };

  const actualizar = async (id: number, modulo: Partial<Modulo>) => {
    try {
      setValidationErrors(null);
      await actualizarModulo(id, modulo);
      await fetchModulos();
      return { success: true };
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error desconocido');
      return { success: false, errors: { general: 'Error al actualizar el módulo' } };
    }
  };

  const eliminar = async (id: number) => {
    try {
      await eliminarModulo(id);
      setModulos((prev) => prev.filter((m) => m.id_modulo !== id));
      return { success: true };
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error desconocido');
      return { success: false, errors: { general: 'Error al eliminar el módulo' } };
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
    modulos,
    loading,
    error,
    validationErrors,
    mostrarErrores,
    fetchModulos,
    crearModulo: crear,
    actualizarModulo: actualizar,
    eliminarModulo: eliminar,
  };
}
