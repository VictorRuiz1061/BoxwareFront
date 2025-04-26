import { useCallback, useEffect, useState } from 'react';
import { Movimiento } from '../types/movimiento';
import { getMovimientos, crearMovimiento, actualizarMovimiento, eliminarMovimiento } from '../api/movimientosApi';

export function useMovimientos() {
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string> | null>(null);

  const fetchMovimientos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMovimientos();
      setMovimientos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al cargar movimientos:', err);
      setError('Error al cargar movimientos');
      setMovimientos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMovimientos();
  }, [fetchMovimientos]);

  const crear = async (movimiento: Omit<Movimiento, 'id_movimiento'>) => {
    try {
      setValidationErrors(null);
      await crearMovimiento(movimiento);
      await fetchMovimientos();
      return { success: true };
    } catch (error) {
      console.error('Error al crear movimiento:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      return { success: false, errors: { general: 'Error al crear el movimiento' } };
    }
  };

  const actualizar = async (id: number, movimiento: Partial<Movimiento>) => {
    try {
      setValidationErrors(null);
      await actualizarMovimiento(id, movimiento);
      await fetchMovimientos();
      return { success: true };
    } catch (error) {
      console.error('Error al actualizar movimiento:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      return { success: false, errors: { general: 'Error al actualizar el movimiento' } };
    }
  };

  const eliminar = async (id: number) => {
    try {
      await eliminarMovimiento(id);
      setMovimientos((prev) => prev.filter((m) => m.id_movimiento !== id));
      return { success: true };
    } catch (error) {
      console.error('Error al eliminar movimiento:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      return { success: false, errors: { general: 'Error al eliminar el movimiento' } };
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
    movimientos,
    loading,
    error,
    validationErrors,
    mostrarErrores,
    fetchMovimientos,
    crearMovimiento: crear,
    actualizarMovimiento: actualizar,
    eliminarMovimiento: eliminar,
  };
}
