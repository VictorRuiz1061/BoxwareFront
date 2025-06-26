import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Programa } from "@/types/programa";

export async function putPrograma(data: Partial<Programa> & { id: number }): Promise<Programa> {
  const response = await axiosInstance.put(`/programas/${data.id}`, data);
  return response.data;
}
  
export function usePutPrograma() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: putPrograma,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programas"] });
    },
  });
} 