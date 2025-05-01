import { usePostSitio } from "@/api/sitio/postSitio";
import { Sitio } from "@/types/sitio";

export function useSitioPost() {
  const post = usePostSitio();

  const crearSitio = async (data: Sitio) => post.mutateAsync(data);

  return { crearSitio };
}


