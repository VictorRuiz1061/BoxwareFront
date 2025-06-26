import { usePostMunicipio as useApiPostMunicipio } from "@/api/municipios";
import { Municipio } from "@/types";

export function usePostMunicipio() {
  const post = useApiPostMunicipio();
  const crearMunicipio = async (data: Municipio) => post.mutateAsync(data);
  return { crearMunicipio };
}