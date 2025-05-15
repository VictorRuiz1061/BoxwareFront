import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Material } from "@/types/material";

export async function putMaterial(params: { id: number; data: Partial<Material> }): Promise<Material> {
  const { id, data } = params;
  try {
    const formData = new FormData();
    
    // Convertir los campos del material a FormData
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'img' && value instanceof File) {
        formData.append('img', value);
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    const response = await axiosInstance.put<Material>(`/materiales/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error al actualizar material:', error);
    throw error;
  }
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
