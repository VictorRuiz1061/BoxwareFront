import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Programa } from "@/types/programa";

export type NuevoPrograma = Omit<Programa, "id_programa">;

export async function postPrograma(data: NuevoPrograma): Promise<Programa> {
  const response = await axiosInstance.post("/programa", data);
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