import { usePutRol as useApiPutRol } from "@/api/rol/putRol";
import { RolUpdate } from "@/api/rol/putRol";

export function usePutRol() {
  const put = useApiPutRol();
  const actualizarRol = async (id: number, data: RolUpdate) => 
    put.mutateAsync({ ...data, id });
  return { actualizarRol };
} 