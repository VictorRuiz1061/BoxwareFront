import { usePostMunicipio as useApiPostMunicipio, NuevoMunicipio } from "@/api/municipios/postMunicipio";

export function usePostMunicipio() {
  const post = useApiPostMunicipio();
  const crearMunicipio = async (data: NuevoMunicipio) => post.mutateAsync(data);
  return { crearMunicipio };
}