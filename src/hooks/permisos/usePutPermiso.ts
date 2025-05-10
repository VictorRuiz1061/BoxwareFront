import { usePutPermiso as useApiPutPermiso } from "@/api/permisos/putPermiso";
import { PermisoUpdate } from "@/api/permisos/putPermiso";

export function usePutPermiso() {
  const put = useApiPutPermiso();
  const actualizarPermiso = async (id: number, data: PermisoUpdate) => 
    put.mutateAsync({ ...data, id });
  return { actualizarPermiso };
} 