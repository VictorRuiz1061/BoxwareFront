import { useCallback, useState } from 'react';
import { useGetTipoMateriales as useApiGetTipoMateriales } from "@/api/tipoMaterial/getTipoMateriales";

export function useGetTipoMateriales() {
  const { data: tipoMateriales = [], isLoading: loading, refetch } = useApiGetTipoMateriales();
  const [error, setError] = useState<string | null>(null);

  const fetchTipoMateriales = useCallback(async () => {
    setError(null);
    try {
      await refetch();
    } catch (err) {
      setError('Error al cargar los tipos de material');
    }
  }, [refetch]);

  return { 
    tipoMateriales, 
    loading, 
    error: error || null,
    fetchTipoMateriales 
  };
}
