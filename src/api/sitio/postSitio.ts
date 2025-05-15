import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Sitio } from "@/types/sitio";

export async function postSitio(sitio: Omit<Sitio, 'id_sitio'>): Promise<Sitio> {
  const response = await axiosInstance.post<Sitio>('/sitios', sitio);
  return response.data;
}

export function usePostSitio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postSitio,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sitios"] });
    },
  });
}
