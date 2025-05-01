import { useDeleteTipoMaterial } from "@/api/tipoMaterial/deleteTipoMaterial";

export function useTipoMaterialDelete() {
  const del = useDeleteTipoMaterial();

  const eliminarTipoMaterial = async (id: number) => del.mutateAsync(id);

  return { eliminarTipoMaterial };
}