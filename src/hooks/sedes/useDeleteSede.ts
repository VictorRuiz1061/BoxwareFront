import { useDeleteSede as useApiDeleteSede } from "@/api/sedes/deleteSede";

export function useDeleteSede() {
  const del = useApiDeleteSede();
  const eliminarSede = async (id_sede: number) => del.mutateAsync(id_sede);
  return { eliminarSede };
} 