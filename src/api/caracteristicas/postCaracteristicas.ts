import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Caracteristica } from "@/types";

export async function postCaracteristica(data: Caracteristica): Promise<Caracteristica> {
  const response = await axiosInstance.post("/caracteristicas", data);
  // Handle nested data structure: response.data.data contains the actual caracteristica
  return response.data.data?.data || response.data.data || response.data;
}

export function usePostCaracteristica() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postCaracteristica,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["caracteristicas"] });
    },
  });
}
