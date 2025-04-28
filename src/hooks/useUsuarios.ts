import { useGetUsuarios } from "@/hooks/usuario/useGetUsuarios";
import { usePostUsuario } from "@/hooks/usuario/usePostUsuario";
import { usePutUsuario } from "@/hooks/usuario/usePutUsuario";
import { useDeleteUsuario } from "@/hooks/usuario/useDeleteUsuario";
import { Usuario } from "@/types/usuario";
import { UsuarioUpdate } from "@/api/usuario/putUsuario";
import { NuevoUsuario } from "@/types/usuario";

export function useUsuarios() {
  const { data: usuarios = [], isLoading: loading } = useGetUsuarios();
  const post = usePostUsuario();
  const put = usePutUsuario();
  const del = useDeleteUsuario();

  const crearUsuario = async (data: NuevoUsuario) => post.mutateAsync(data);
  const actualizarUsuario = async (id: number, data: UsuarioUpdate) => put.mutateAsync({ ...data, id });
  const eliminarUsuario = async (id: number) => del.mutateAsync(id);

  return { usuarios, loading, crearUsuario, actualizarUsuario, eliminarUsuario };
}
