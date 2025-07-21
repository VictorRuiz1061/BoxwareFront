import { usePutUsuario as useApiPutUsuario } from "@/api/usuario";
import { Usuario } from "@/types";

export function usePutUsuario() {
  const put = useApiPutUsuario();
  const actualizarUsuario = async (id: number, data: Partial<Usuario> | FormData) => put.mutateAsync({ id, data });
  return { actualizarUsuario };
}
