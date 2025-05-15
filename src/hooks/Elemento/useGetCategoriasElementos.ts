import { useCallback, useState } from 'react';
import { useGetCategoriasElementos as useApiGetCategoriasElementos } from "@/api/Elemento/getCategoriasElementos";

export function useGetCategoriasElementos() {
  const { data: categorias = [], isLoading: loading, refetch } = useApiGetCategoriasElementos();
  const [error, setError] = useState<string | null>(null);

  const fetchCategorias = useCallback(async () => {
    setError(null);
    try {
      await refetch();
    } catch (err) {
      setError('Error al cargar las categorías');
    }
  }, [refetch]);

  return { 
    categorias, 
    loading, 
    error: error || null,
    fetchCategorias 
  };
}
