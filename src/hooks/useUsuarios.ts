import { useGetUsuarios } from "@/api/usuario/getUsuarios";
import { usePostUsuario } from "@/api/usuario/postUsuario";
import { usePutUsuario } from "@/api/usuario/putUsuario";
import { useDeleteUsuario } from "@/api/usuario/deleteUsuario";
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
