import { usePostSitio as useApiPostSitio } from "@/api/sitio/postSitio";
import { Sitio } from "@/types/sitio";

export function usePostSitio() {
  const post = useApiPostSitio();
  const crearSitio = async (data: Sitio) => post.mutateAsync(data);
  return { crearSitio, isLoading: post.isPending };
}
