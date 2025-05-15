import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from '@/api/axiosConfig';
import { Movimiento } from '@/types/movimiento';

export async function putMovimiento(params: { id: number; data: Partial<Movimiento> }): Promise<Movimiento> {
  const { id, data } = params;
  const response = await axiosInstance.put<Movimiento>(`/movimientos/${id}`, data);
  return response.data;
};

export function usePutMovimiento() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: putMovimiento,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movimientos"] });
    },
  });
}
