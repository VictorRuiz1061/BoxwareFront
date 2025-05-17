import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Material } from "@/types/material";

export async function putMaterial(data: Partial<Material> & { id: number }): Promise<Material> {
  const response = await axiosInstance.put(`/materiales/${data.id}`, data);
  return response.data;
}

export function usePutMaterial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: putMaterial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materiales"] });
    },
  });
}
