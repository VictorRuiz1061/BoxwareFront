import { useDeleteMaterial } from "@/api/material/deleteMaterial";

export function useMaterialDelete() {
  const del = useDeleteMaterial();

  const eliminarMaterial = async (id: number) => del.mutateAsync(id);

  return { eliminarMaterial };
}