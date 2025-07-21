import { usePostCentro as useApiPostCentro } from "@/api/centros";
import { Centro } from "@/types";

export function usePostCentro() {
  const post = useApiPostCentro();
  const crearCentro = async (data: Centro) => post.mutateAsync(data);
  return { crearCentro };
}
