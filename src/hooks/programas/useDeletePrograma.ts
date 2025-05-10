import { useDeletePrograma as useApiDeletePrograma } from "@/api/programas/deletePrograma";

export function useDeletePrograma() {
  const del = useApiDeletePrograma();
  const eliminarPrograma = async (id_programa: number) => del.mutateAsync(id_programa);
  return { eliminarPrograma };
} 