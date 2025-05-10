import { usePostCentro as useApiPostCentro } from "@/api/centros/postCentro";
import { NuevoCentro } from "@/api/centros/postCentro";

export function usePostCentro() {
  const post = useApiPostCentro();
  const crearCentro = async (data: NuevoCentro) => post.mutateAsync(data);
  return { crearCentro };
} 