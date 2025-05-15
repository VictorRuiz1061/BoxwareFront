import axiosInstance from '../axiosConfig';
import { TipoMovimiento } from '@/types/tipoMovimiento';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface PutTipoMovimientoParams {
  id: number;
  data: Partial<TipoMovimiento>;
}

export async function putTipoMovimiento({ id, data }: PutTipoMovimientoParams): Promise<TipoMovimiento> {
  const response = await axiosInstance.put(`/tipos-movimientos/${id}`, data);
  return response.data;
}

export function usePutTipoMovimiento() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: putTipoMovimiento,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tiposMovimiento"] });
    },
  });

  return {
    actualizarTipoMovimiento: (id: number, data: Partial<TipoMovimiento>) => 
      mutation.mutate({ id, data }),
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}
