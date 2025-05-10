import { usePostUsuario as useApiPostUsuario } from "@/api/usuario/postUsuario";
import { NuevoUsuario } from "@/types/usuario";

export function usePostUsuario() {
  const post = useApiPostUsuario();
  const crearUsuario = async (data: NuevoUsuario) => post.mutateAsync(data);
  return { crearUsuario };
}