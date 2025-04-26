import { useCallback, useEffect, useState } from 'react';
import { TipoMovimiento } from '../types/tipoMovimiento';
import { getTiposMovimiento, crearTipoMovimiento, actualizarTipoMovimiento, eliminarTipoMovimiento } from '../api/tiposMovimientoApi';

export function useTiposMovimiento() {
  const [tiposMovimiento, setTiposMovimiento] = useState<TipoMovimiento[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string> | null>(null);

  const fetchTiposMovimiento = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTiposMovimiento();
      setTiposMovimiento(data);
      setError(null);
    } catch (e) {
      setError('Error al cargar los tipos de movimiento');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTiposMovimiento();
  }, [fetchTiposMovimiento]);

  const crear = async (tipoMovimiento: Omit<TipoMovimiento, 'id_tipo_movimiento'>) => {
    try {
      setValidationErrors(null);
      await crearTipoMovimiento(tipoMovimiento);
      await fetchTiposMovimiento();
      return { success: true };
    } catch (error) {
      console.error('Error al crear tipo de movimiento:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      return { success: false, errors: { general: 'Error al crear el tipo de movimiento' } };
    }
  };

  const actualizar = async (id: number, tipoMovimiento: Partial<TipoMovimiento>) => {
    try {
      setValidationErrors(null);
      await actualizarTipoMovimiento(id, tipoMovimiento);
      await fetchTiposMovimiento();
      return { success: true };
    } catch (error) {
      console.error('Error al actualizar tipo de movimiento:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      return { success: false, errors: { general: 'Error al actualizar el tipo de movimiento' } };
    }
  };

  const eliminar = async (id: number) => {
    try {
      await eliminarTipoMovimiento(id);
      setTiposMovimiento((prev) => prev.filter((t) => t.id_tipo_movimiento !== id));
      return { success: true };
    } catch (error) {
      console.error('Error al eliminar tipo de movimiento:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      return { success: false, errors: { general: 'Error al eliminar el tipo de movimiento' } };
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
    tiposMovimiento,
    loading,
    error,
    validationErrors,
    mostrarErrores,
    crearTipoMovimiento: crear,
    actualizarTipoMovimiento: actualizar,
    eliminarTipoMovimiento: eliminar,
    fetchTiposMovimiento,
  };
}
