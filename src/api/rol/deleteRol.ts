import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";

export async function deleteRol(id: number): Promise<void> {
  await axiosInstance.delete(`/roles/${id}`);
}

export function useDeleteRol() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteRol,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
} 