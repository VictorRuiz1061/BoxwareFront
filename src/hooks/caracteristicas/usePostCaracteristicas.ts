import { usePostCaracteristica as useApiPostCaracteristica } from "@/api/caracteristicas";
import { Caracteristica } from "@/types";

export function usePostCaracteristica() {
  const post = useApiPostCaracteristica();
  const crearCaracteristica = async (data: Caracteristica) => post.mutateAsync(data);
  return { crearCaracteristica };
}
