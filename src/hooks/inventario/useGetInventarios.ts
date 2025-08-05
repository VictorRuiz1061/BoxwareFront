import { useGetInventarios as useApiGetInventarios } from '@/api/inventario';

export function useGetInventarios() {
  const query = useApiGetInventarios();
  return {
    inventarios: query.data || [],
    loading: query.isLoading,
    error: query.error
  };
} 