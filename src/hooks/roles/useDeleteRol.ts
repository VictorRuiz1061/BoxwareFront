import { useDeleteRol as useApiDeleteRol } from "@/api/rol/deleteRol";

export function useDeleteRol() {
  const del = useApiDeleteRol();
  const eliminarRol = async (id: number) => del.mutateAsync(id);
  return { eliminarRol };
} 