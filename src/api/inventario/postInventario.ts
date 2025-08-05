import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from '@/api/axiosConfig';
import { Inventario } from '@/types/inventario';

export async function postInventario(data: Inventario): Promise<Inventario> {
  try {
    const response = await axiosInstance.post<Inventario>('/inventario', data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export function usePostInventario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postInventario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventarios"] });
    },
  });
}
