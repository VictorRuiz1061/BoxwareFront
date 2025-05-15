import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from '@/api/axiosConfig';
import { Movimiento } from '@/types/movimiento';

export async function postMovimiento(movimiento: Omit<Movimiento, 'id_movimiento'>): Promise<Movimiento> {
  const response = await axiosInstance.post<Movimiento>('/movimientos', movimiento);
  return response.data;
};

export function usePostMovimiento() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postMovimiento,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movimientos"] });
    },
  });
}

