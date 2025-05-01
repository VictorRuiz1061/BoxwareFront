import { usePutMaterial } from "@/api/material/putMaterial";
import { MaterialUpdate } from "@/api/material/putMaterial";

export function useMaterialPut() {
  const put = usePutMaterial();

  const actualizarMaterial = async (id: number, data: MaterialUpdate) =>
    put.mutateAsync({ ...data, id_material: id });

  return { actualizarMaterial };
}