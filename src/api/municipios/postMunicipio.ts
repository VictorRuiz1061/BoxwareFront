import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Municipio } from "@/types/municipio";

export type NuevoMunicipio = Omit<Municipio, "id_municipio">;

export async function postMunicipio(data: NuevoMunicipio): Promise<Municipio> {
  const response = await axiosInstance.post("/municipios/crear", data);
  return response.data;
}

export function usePostMunicipio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postMunicipio,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["municipios"] });
    },
  });
} 