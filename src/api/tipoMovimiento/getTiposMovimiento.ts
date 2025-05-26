import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../axiosConfig';
import { TipoMovimiento } from '@/types/tipoMovimiento';

export async function getTiposMovimiento(): Promise<TipoMovimiento[]> {
  const response = await axiosInstance.get("/tipos-movimientos");
  return response.data;
}

export function useGetTiposMovimiento() {
  return useQuery({
    queryKey: ["tiposMovimiento"],
    queryFn: getTiposMovimiento,
  });
}
