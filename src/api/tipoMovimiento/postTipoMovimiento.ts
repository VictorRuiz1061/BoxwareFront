import axiosInstance from '../axiosConfig';
import { TipoMovimiento } from '@/types/tipoMovimiento';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export async function postTipoMovimiento(data: Omit<TipoMovimiento, 'id_tipo_movimiento'>): Promise<TipoMovimiento> {
  const response = await axiosInstance.post("/tipos-movimientos", data);
  return response.data;
}

export function usePostTipoMovimiento() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: postTipoMovimiento,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tiposMovimiento"] });
    },
  });

  return {
    crearTipoMovimiento: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}
