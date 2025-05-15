import { useCallback, useState } from 'react';
import { useGetMateriales as useApiGetMateriales } from '@/api/material/getMateriales';

export function useGetMateriales() {
  const { data: materialesData = [], isLoading: loading, error: apiError, refetch } = useApiGetMateriales();
  const [error, setError] = useState<string | null>(null);

  const fetchMateriales = useCallback(async () => {
    setError(null);
    try {
      await refetch();
    } catch (err) {
      setError('Error al cargar los materiales');
    }
  }, [refetch]);

  return {
    materiales: materialesData,
    loading,
    error: error || (apiError ? 'Error al cargar los materiales' : null),
    fetchMateriales
  };
}
