import { useState } from 'react';
import { eliminarMovimiento } from '../../api/movimiento/deleteMovimiento';

export function useDeleteMovimiento() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const eliminarMovimientoExistente = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await eliminarMovimiento(id);
      setLoading(false);
      return { success: true };
    } catch (err) {
      console.error('Error al eliminar movimiento:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setLoading(false);
      return { success: false, error: err instanceof Error ? err.message : 'Error desconocido' };
    }
  };

  return {
    eliminarMovimiento: eliminarMovimientoExistente,
    loading,
    error
  };
}
