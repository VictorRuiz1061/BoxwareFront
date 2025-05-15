import { useCallback, useState } from 'react';
import { useGetTiposMovimiento as useApiGetTiposMovimiento } from "@/api/tipoMovimiento/getTiposMovimiento";

export function useGetTiposMovimiento() {
  const { data: tiposMovimiento = [], isLoading: loading, refetch } = useApiGetTiposMovimiento();
  const [error, setError] = useState<string | null>(null);

  const fetchTiposMovimiento = useCallback(async () => {
    setError(null);
    try {
      await refetch();
    } catch (err) {
      setError('Error al cargar los tipos de movimiento');
    }
  }, [refetch]);

  return { 
    tiposMovimiento, 
    loading, 
    error: error || null,
    fetchTiposMovimiento,
    refetch 
  };
}
