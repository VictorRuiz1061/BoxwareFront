import { useQuery } from "@tanstack/react-query";
import axiosInstance from '@/api/axiosConfig';
import { Movimiento } from '@/types/movimiento';

export async function getMovimientos(): Promise<Movimiento[]> {
  const response = await axiosInstance.get<Movimiento[]>('/movimientos');
  return response.data;
};

export async function getMovimientoById(id: number): Promise<Movimiento> {
  const response = await axiosInstance.get<Movimiento>(`/movimientos/${id}`);
  return response.data;
};

export function useGetMovimientos() {
  return useQuery({
    queryKey: ["movimientos"],
    queryFn: getMovimientos
  });
}

export function useGetMovimientoById(id: number) {
  return useQuery({
    queryKey: ["movimiento", id],
    queryFn: () => getMovimientoById(id),
    enabled: !!id
  });
}
