import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Municipio } from "@/types/municipio";

// Tipo parcial para crear un nuevo municipio
export type NuevoMunicipio = Partial<Omit<Municipio, "id_municipio">> & {
  nombre_municipio: string; // Solo el nombre es obligatorio
};

export async function postMunicipio(data: NuevoMunicipio): Promise<Municipio> {
  console.log('Enviando datos para crear municipio:', data);
  const response = await axiosInstance.post("/municipios", data);
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