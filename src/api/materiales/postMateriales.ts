import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Material } from "@/types/material";

export async function postMaterial(data: Partial<Material> & { imagen?: File | string }): Promise<Material> {
    // Crear FormData para enviar archivos
    const formData = new FormData();
    
    // Agregar todos los campos del material al FormData
    Object.keys(data).forEach(key => {
      const value = data[key as keyof typeof data];
      if (key === 'imagen' && value instanceof File) {
        // Si es un archivo, agregarlo como archivo
        formData.append('imagen', value);
      } else if (key !== 'imagen' && value !== undefined) {
        // Si no es imagen, agregarlo como string
        formData.append(key, String(value));
      }
    });

    const response = await axiosInstance.post("/materiales", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
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
