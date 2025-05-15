import { useState } from 'react';
import { Movimiento } from '../../types/movimiento';
import { postMovimiento } from '../../api/movimiento/postMovimiento';

export function usePostMovimiento() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const crearNuevoMovimiento = async (movimiento: Omit<Movimiento, 'id_movimiento'>) => {
    setLoading(true);
    setError(null);
    try {
      const resultado = await postMovimiento(movimiento);
      setLoading(false);
      return { success: true, data: resultado };
    } catch (err) {
      console.error('Error al crear movimiento:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setLoading(false);
      return { success: false, error: err instanceof Error ? err.message : 'Error desconocido' };
    }
  };

  return {
    crearMovimiento: crearNuevoMovimiento,
    loading,
    error
  };
}
