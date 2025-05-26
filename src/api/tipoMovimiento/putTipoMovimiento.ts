import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../axiosConfig';
import { TipoMovimiento } from '@/types/tipoMovimiento';

export async function putTipoMovimiento(data: Partial<TipoMovimiento> & { id: number }): Promise<TipoMovimiento> {
  const response = await axiosInstance.put(`/tipos-movimientos/${data.id}`, data);
  return response.data;
}

export function usePutTipoMovimiento() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: putTipoMovimiento,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tiposMovimiento"] });
    },
  });
}
