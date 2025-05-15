import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Sitio } from "@/types/sitio";

export async function putSitio(params: { id: number; data: Partial<Sitio> }): Promise<Sitio> {
  const { id, data } = params;
  const response = await axiosInstance.put<Sitio>(`/sitios/${id}`, data);
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
