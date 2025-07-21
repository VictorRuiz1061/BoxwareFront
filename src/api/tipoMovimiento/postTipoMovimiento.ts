import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/api/axiosConfig';
import { TipoMovimiento } from '@/types/tipoMovimiento';

export async function postTipoMovimiento(data: TipoMovimiento): Promise<TipoMovimiento> {
  const response = await axiosInstance.post("/tipos-movimientos", data);
  return response.data;
}

export function usePostTipoMovimiento() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postTipoMovimiento,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tiposMovimiento"] });
    },
  });
}
