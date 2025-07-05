import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../axiosConfig';
import { TipoMovimiento } from '@/types/tipoMovimiento';
import { extractArrayData } from '@/utils/responseHandler';

export async function getTiposMovimiento(): Promise<TipoMovimiento[]> {
  const response = await axiosInstance.get("/tipos-movimientos");
  return extractArrayData<TipoMovimiento>(response, 'getTiposMovimiento');
}

export function useGetTiposMovimiento() {
  return useQuery({
    queryKey: ["tiposMovimiento"],
    queryFn: getTiposMovimiento,
  });
}
