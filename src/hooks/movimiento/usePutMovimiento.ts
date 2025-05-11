import { useState } from 'react';
import { Movimiento } from '../../types/movimiento';
import { actualizarMovimiento } from '../../api/movimiento/putMovimiento';

export function usePutMovimiento() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const actualizarMovimientoExistente = async (id: number, movimiento: Partial<Movimiento>) => {
    setLoading(true);
    setError(null);
    try {
      const resultado = await actualizarMovimiento(id, movimiento);
      setLoading(false);
      return { success: true, data: resultado };
    } catch (err) {
      console.error('Error al actualizar movimiento:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setLoading(false);
      return { success: false, error: err instanceof Error ? err.message : 'Error desconocido' };
    }
  };

  return {
    actualizarMovimiento: actualizarMovimientoExistente,
    loading,
    error
  };
}
