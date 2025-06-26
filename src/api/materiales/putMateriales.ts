import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Material } from "@/types/material";

export async function putMaterial(data: Partial<Material>): Promise<Material> {
    if (!data.id_material) {
      throw new Error('id_material es requerido para actualizar un material');
    }
    const id = data.id_material;
    const response = await axiosInstance.put(`/materiales/${id}`, data);
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
