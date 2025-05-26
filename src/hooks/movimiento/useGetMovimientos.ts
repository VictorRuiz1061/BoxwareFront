import { useGetMovimientos as useApiGetMovimientos } from '@/api/movimiento/getMovimientos';

export function useGetMovimientos() {
  const { data: movimientos = [], isLoading: loading } = useApiGetMovimientos();
  return { movimientos, loading };
}
