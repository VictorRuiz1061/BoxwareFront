import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Caracteristica } from "@/types";

export async function postCaracteristicas(data: Caracteristica): Promise<Caracteristica> {
  const response = await axiosInstance.post("/caracteristicas", data);
  return response.data;
}

export function usePostCaracteristicas() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postCaracteristicas,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["caracteristica"] });
    },
  });
}
