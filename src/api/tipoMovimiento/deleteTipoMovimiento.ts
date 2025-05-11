import axiosInstance from '../axiosConfig';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export async function deleteTipoMovimiento(id: number): Promise<void> {
  await axiosInstance.delete(`/tipos-movimientos/${id}`);
}

export function useDeleteTipoMovimiento() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteTipoMovimiento,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tiposMovimiento"] });
    },
  });

  return {
    eliminarTipoMovimiento: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}
