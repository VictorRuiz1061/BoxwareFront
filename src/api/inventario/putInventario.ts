import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from '@/api/axiosConfig';
import { Inventario } from '@/types/inventario';

export async function putInventario(id: number, data: Inventario): Promise<Inventario> {
  try { 
    const response = await axiosInstance.put<Inventario>(`/inventario/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export function usePutInventario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Inventario }) => putInventario(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventarios"] });
    },
  });
}
