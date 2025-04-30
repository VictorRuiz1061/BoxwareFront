import { useGetPermisos } from "@/api/permisos/getPermisos";
import { usePostPermiso } from "@/api/permisos/postPermiso";
import { usePutPermiso } from "@/api/permisos/putPermiso";
import { useDeletePermiso } from "@/api/permisos/deletePermiso";
import { PermisoUpdate } from "@/api/permisos/putPermiso";
import { NuevoPermiso } from "@/api/permisos/postPermiso";

export function usePermisos() {
  const { data: permisos = [], isLoading: loading } = useGetPermisos();
  const post = usePostPermiso();
  const put = usePutPermiso();
  const del = useDeletePermiso();

  const crearPermiso = async (data: NuevoPermiso) => post.mutateAsync(data);
  const actualizarPermiso = async (id: number, data: PermisoUpdate) => put.mutateAsync({ ...data, id });
  const eliminarPermiso = async (id: number) => del.mutateAsync(id);

  return { permisos, loading, crearPermiso, actualizarPermiso, eliminarPermiso };
}
