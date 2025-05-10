import { usePutUsuario as useApiPutUsuario } from "@/api/usuario/putUsuario";
import { Usuario as UsuarioUpdate } from "@/types/usuario";

export function usePutUsuario() {
  const put = useApiPutUsuario();
  const actualizarUsuario = async (id: number, data: UsuarioUpdate) => put.mutateAsync({ ...data, id });
  return { actualizarUsuario };
} 