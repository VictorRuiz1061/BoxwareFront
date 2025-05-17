import { usePutUsuario as useApiPutUsuario } from "@/api/usuario/putUsuario";
import { Usuario } from "@/types/usuario";

export function usePutUsuario() {
  const put = useApiPutUsuario();
  const actualizarUsuario = async (id: number, data: Usuario) => put.mutateAsync({ ...data, id });
  return { actualizarUsuario };
} 