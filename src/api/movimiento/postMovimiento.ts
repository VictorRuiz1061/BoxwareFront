import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from '@/api/axiosConfig';
import { Movimiento } from '@/types/movimiento';

export async function postMovimiento(data: Movimiento): Promise<Movimiento> {
  try {
    const response = await axiosInstance.post<Movimiento>('/movimientos', data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export function usePostMovimiento() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postMovimiento,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movimientos"] });
    },
  });
}
