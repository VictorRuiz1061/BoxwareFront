import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Material } from "@/types/material";

export async function postMaterial(data: Partial<Material>): Promise<Material> {
    console.log('Enviando datos al backend:', JSON.stringify(data));
    try {
        const response = await axiosInstance.post("/materiales", data);
        return response.data;
    } catch (error: any) {
        // Mostrar el mensaje de error completo
        console.error('Error en postMaterial:', error.response?.data || error.message);
        
        // Mostrar detalles adicionales si están disponibles
        if (error.response?.data?.error) {
            console.error('Detalles del error:', JSON.stringify(error.response.data.error));
        }
        
        // Si hay un mensaje específico en el error, mostrarlo
        if (error.response?.data?.message && Array.isArray(error.response.data.message)) {
            console.error('Mensajes de validación:', error.response.data.message);
        }
        
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
