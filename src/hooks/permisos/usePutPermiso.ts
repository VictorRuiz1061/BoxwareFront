import { usePutPermiso as useApiPutPermiso } from "@/api/permisos/putPermiso";
import { Permiso } from "@/types/permiso";

export function usePutPermiso() {
  const put = useApiPutPermiso();
  const actualizarPermiso = async (id: number, data: Permiso) => put.mutateAsync({ ...data, id });
  return { actualizarPermiso };
}
