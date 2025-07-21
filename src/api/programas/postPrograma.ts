import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Programa } from "@/types";

export async function postPrograma(data: Programa): Promise<Programa> {
  const response = await axiosInstance.post("/programas", {
    nombre_programa: data.nombre_programa,
    estado: data.estado,
    area_id: data.area_id
  });
  return response.data.data.data;
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