import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Sitio } from "@/types/sitio";

export async function putSitio(data: Partial<Sitio> & { id: number }): Promise<Sitio> {
  const response = await axiosInstance.put<Sitio>(`/sitios/${data.id}`, data);
  return response.data;
}

export function usePutSitio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: putSitio,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sitios"] });
    },
  });
}
