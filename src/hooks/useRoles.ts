import { useGetRoles } from "@/hooks/roles/useGetRoles";
import { usePostRol } from "@/hooks/roles/usePostRol";
import { usePutRol } from "@/hooks/roles/usePutRol";
import { useDeleteRol } from "@/hooks/roles/useDeleteRol";
import { RolUpdate } from "@/api/rol/putRol";
import { NuevoRol } from "@/api/rol/postRol";

export function useRoles() {
  const { data: roles = [], isLoading: loading } = useGetRoles();
  const post = usePostRol();
  const put = usePutRol();
  const del = useDeleteRol();

  const crearRol = async (data: NuevoRol) => post.mutateAsync(data);
  const actualizarRol = async (id: number, data: RolUpdate) => put.mutateAsync({ ...data, id });
  const eliminarRol = async (id: number) => del.mutateAsync(id);

  return { roles, loading, crearRol, actualizarRol, eliminarRol };
}
