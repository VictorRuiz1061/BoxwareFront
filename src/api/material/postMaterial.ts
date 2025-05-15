import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Material } from "@/types/material";

export async function postMaterial(material: Omit<Material, 'id_material'>): Promise<Material> {
  try {
    const formData = new FormData();
    
    // Convertir los campos del material a FormData
    Object.entries(material).forEach(([key, value]) => {
      if (key === 'img' && value instanceof File) {
        formData.append('img', value);
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    const response = await axiosInstance.post<Material>('/materiales', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error al crear material:', error);
    throw error;
  }
}

export function usePostMaterial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postMaterial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materiales"] });
    },
  });
}
