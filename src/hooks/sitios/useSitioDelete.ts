import { useDeleteSitio } from "@/api/sitio/deleteSitio";

export function useSitioDelete() {
  const del = useDeleteSitio();

  const eliminarSitio = async (id: number) => del.mutateAsync(id);

  return { eliminarSitio };
}