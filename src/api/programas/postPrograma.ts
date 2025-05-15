import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Programa } from "@/types/programa";

// Modificando para permitir id_programa opcional
export interface NuevoPrograma {
  id_programa?: number; // Opcional para creación, el backend podría generarlo
  nombre_programa: string;
  area_id: number;
  estado: string;
  fecha_creacion: string;
  fecha_modificacion: string;
}

export async function postPrograma(data: NuevoPrograma): Promise<Programa> {
  const response = await axiosInstance.post("/programas", data);
  return response.data;
}

export function usePostPrograma() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postPrograma,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programas"] });
    },
  });
} 