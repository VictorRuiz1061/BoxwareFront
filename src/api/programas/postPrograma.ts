import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Programa } from "@/types/programa";

export async function postPrograma(data: Programa): Promise<Programa> {
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