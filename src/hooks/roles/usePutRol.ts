import { usePutRol as useApiPutRol } from "@/api/rol";
import { Rol } from "@/types";

export function usePutRol() {
  const put = useApiPutRol();
  const actualizarRol = async (id: number, data: Partial<Rol>) => put.mutateAsync({ id, ...data });
  return { actualizarRol };
}
