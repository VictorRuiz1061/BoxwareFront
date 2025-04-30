import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Sitio } from "@/types/sitio";

export async function postSitio(data: Sitio): Promise<Sitio> {
  const response = await axiosInstance.post("/sitios", data);
  return response.data;
}

export function usePostSitio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postSitio,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sitios"] });
    },
    onError: (error) => {
      console.error("Error al crear sitio:", error);
    },
  });
}
