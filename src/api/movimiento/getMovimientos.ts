import { useQuery } from "@tanstack/react-query";
import axiosInstance from '@/api/axiosConfig';
import { Movimiento } from '@/types/movimiento';

export async function getMovimientos(): Promise<Movimiento[]> {
  const response = await axiosInstance.get("/movimientos");
  return response.data;
};

export function useGetMovimientos() {
  return useQuery({
    queryKey: ["movimientos"],
    queryFn: getMovimientos
  });
}
