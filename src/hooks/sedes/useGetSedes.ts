import { useCallback, useState } from 'react';
import { useGetSedes as useApiGetSedes } from "@/api/sedes/getSedes";

export function useGetSedes() {
  const { data: sedes = [], isLoading: loading, refetch } = useApiGetSedes();
  const [error, setError] = useState<string | null>(null);

  const fetchSedes = useCallback(async () => {
    setError(null);
    try {
      await refetch();
    } catch (err) {
      setError('Error al cargar las sedes');
    }
  }, [refetch]);

  return { 
    sedes, 
    loading, 
    error: error || null,
    fetchSedes 
  };
}