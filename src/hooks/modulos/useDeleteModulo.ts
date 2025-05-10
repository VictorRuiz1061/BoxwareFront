import { useDeleteModulo as useApiDeleteModulo } from "@/api/modulos/deleteModulo";

export function useDeleteModulo() {
  const del = useApiDeleteModulo();
  const eliminarModulo = async (id: number) => del.mutateAsync(id);
  return { eliminarModulo };
} 