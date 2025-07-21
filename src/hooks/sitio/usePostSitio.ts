import { usePostSitio as useApiPostSitio } from "@/api/sitio";
import { Sitio } from "@/types";

export function usePostSitio() {
  const post = useApiPostSitio();
  const crearSitio = async (data: Sitio) => post.mutateAsync(data);
  return { crearSitio, isLoading: post.isPending };
}
