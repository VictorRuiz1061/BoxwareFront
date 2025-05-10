import { usePutCentro as useApiPutCentro } from "@/api/centros/putCentro";
import { CentroUpdate } from "@/api/centros/putCentro";

export function usePutCentro() {
  const put = useApiPutCentro();
  const actualizarCentro = async (id_centro: number, data: CentroUpdate) => put.mutateAsync({ ...data, id_centro });
  return { actualizarCentro };
} 