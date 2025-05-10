import { useDeletePermiso as useApiDeletePermiso } from "@/api/permisos/deletePermiso";

export function useDeletePermiso() {
  const del = useApiDeletePermiso();
  const eliminarPermiso = async (id: number) => del.mutateAsync(id);
  return { eliminarPermiso };
} 