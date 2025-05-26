import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Permiso } from "@/types/permiso";

export async function putPermiso(data: Partial<Permiso> & { id: number }): Promise<Permiso> {
  const response = await axiosInstance.put(`/permisos/${data.id}`, data);
  return response.data;
}

export function usePutPermiso() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: putPermiso,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permisos"] });
    },
  });
} 