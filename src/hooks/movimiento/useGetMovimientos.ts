import { useCallback, useEffect, useState } from 'react';
import { Movimiento } from '../../types/movimiento';
import { getMovimientos } from '../../api/movimiento/getMovimientos';

export function useGetMovimientos() {
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return {
    movimientos,
    loading,
    error,
    fetchMovimientos
  };
}
