import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from '@/api/axiosConfig';
import { Movimiento } from '@/types/movimiento';

export async function putMovimiento(data: Partial<Movimiento> & { id: number }): Promise<Movimiento> {
  const response = await axiosInstance.put(`/movimientos/${data.id}`, data);
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
