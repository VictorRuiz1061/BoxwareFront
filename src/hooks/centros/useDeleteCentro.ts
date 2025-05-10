import { useDeleteCentro as useApiDeleteCentro } from "@/api/centros/deleteCentro";

export function useDeleteCentro() {
  const del = useApiDeleteCentro();
  const eliminarCentro = async (id_centro: number) => del.mutateAsync(id_centro);
  return { eliminarCentro };
} 