import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Municipio } from "@/types/municipio";

export async function putMunicipio(data: Partial<Municipio> & { id: number }): Promise<Municipio> {
  const response = await axiosInstance.put(`/municipios/${data.id}`, data);
  return response.data;
}

export function usePutMunicipio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: putMunicipio,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["municipios"] });
    },
  });
}
