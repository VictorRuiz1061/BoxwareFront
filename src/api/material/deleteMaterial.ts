import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";

export async function deleteMaterial(id: number): Promise<void> {
  try {
    await axiosInstance.delete(`/materiales/${id}`);
  } catch (error) {
    console.error('Error al eliminar material:', error);
    throw error;
  }
}

export function useDeleteMaterial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMaterial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materiales"] });
    },
  });
}
