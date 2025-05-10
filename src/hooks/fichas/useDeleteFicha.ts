import { useDeleteFicha as useApiDeleteFicha } from "@/api/fichas/deleteFicha";

export function useDeleteFicha() {
  const del = useApiDeleteFicha();
  const eliminarFicha = async (id_ficha: number) => del.mutateAsync(id_ficha);
  return { eliminarFicha };
} 