import { usePostMunicipio as useApiPostMunicipio } from "@/api/municipios/postMunicipio";
import { Municipio } from "@/types/municipio";

export function usePostMunicipio() {
  const post = useApiPostMunicipio();
  const crearMunicipio = async (data: Municipio) => post.mutateAsync(data);
  return { crearMunicipio };
}