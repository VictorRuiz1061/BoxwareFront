import { usePostCaracteristicas as useApiPostCaracteristicas } from "@/api/caracteristicas";
import { Caracteristica } from "@/types";

export function usePostCaracteristica() {
  const post = useApiPostCaracteristicas();
  const crearCaracteristica = async (data: Caracteristica) => post.mutateAsync(data);
  return { crearCaracteristica };
}