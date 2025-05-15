import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from '@/api/axiosConfig';

export async function deleteMovimiento(id: number): Promise<void> {
  await axiosInstance.delete(`/movimientos/${id}`);
};

export function useDeleteMovimiento() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMovimiento,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movimientos"] });
    },
  });
}
