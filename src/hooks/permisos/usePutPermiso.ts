import { usePutPermiso as useApiPutPermiso } from "@/api/permisos";
import { Permiso } from "@/types";

export function usePutPermiso() {
  const put = useApiPutPermiso();
  const actualizarPermiso = async (id: number, data: Permiso) => {
    // Convertir id_permiso a id para la API
    const apiData = {
      ...data,
      id: id // La API espera 'id', no 'id_permiso'
    };
    return put.mutateAsync(apiData);
  };
  return { actualizarPermiso };
}
