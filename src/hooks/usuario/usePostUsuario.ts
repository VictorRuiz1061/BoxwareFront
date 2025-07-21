import { usePostUsuario as useApiPostUsuario } from "@/api/usuario";
import { Usuario } from "@/types";

export function usePostUsuario() {
  const post = useApiPostUsuario();
  const crearUsuario = async (data: Usuario) => post.mutateAsync(data);
  return { crearUsuario };
}