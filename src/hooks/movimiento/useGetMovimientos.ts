import { useGetMovimientos as useApiGetMovimientos } from '@/api/movimiento';

export function useGetMovimientos() {
  const { data: movimientos = [], isLoading: loading } = useApiGetMovimientos();
  return { movimientos, loading };
}
