import { usePostCentro as useApiPostCentro } from "@/api/centros/postCentro";
import { Centro } from "@/types/centro";

export function usePostCentro() {
  const post = useApiPostCentro();
  const crearCentro = async (data: Centro) => post.mutateAsync(data);
  return { crearCentro };
}
