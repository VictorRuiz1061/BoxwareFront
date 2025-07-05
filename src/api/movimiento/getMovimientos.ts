import { useQuery } from "@tanstack/react-query";
import axiosInstance from '@/api/axiosConfig';
import { Movimiento } from '@/types/movimiento';
import { extractArrayData } from '@/utils/responseHandler';

export async function getMovimientos(): Promise<Movimiento[]> {
  const response = await axiosInstance.get("/movimientos");
  return extractArrayData<Movimiento>(response, 'getMovimientos');
};

export function useGetMovimientos() {
  return useQuery({
    queryKey: ["movimientos"],
    queryFn: getMovimientos
  });
}
