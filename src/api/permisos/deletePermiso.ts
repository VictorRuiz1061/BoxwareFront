import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";

export async function deletePermiso(id: number): Promise<void> {
  await axiosInstance.delete(`/permisos/${id}`);
}

export function useDeletePermiso() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePermiso,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permisos"] });
    },
  });
} 