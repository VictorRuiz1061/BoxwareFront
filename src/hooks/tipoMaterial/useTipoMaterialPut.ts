import { usePutTipoMaterial, TipoMaterialUpdate } from "@/api/tipoMaterial/putTipoMateria";

export function useTipoMaterialPut() {
  const put = usePutTipoMaterial();

  const actualizarTipoMaterial = async (id: number, data: TipoMaterialUpdate) =>
    put.mutateAsync({ ...data, id_tipo_material: id });

  return { actualizarTipoMaterial };
}