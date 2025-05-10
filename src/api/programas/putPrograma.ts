import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Programa } from "@/types/programa";

export interface ProgramaUpdate {
  id_programa: number;
  // otros campos opcionales si es necesario
}

export async function putPrograma(id: number, data: Partial<Programa>): Promise<Programa> {
  const response = await axiosInstance.put(`/programa/${id}`, data);
  return response.data;
}

export function usePutPrograma() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id_programa, ...data }: Programa & { id_programa: number }) => putPrograma(id_programa, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programas"] });
    },
  });
} 