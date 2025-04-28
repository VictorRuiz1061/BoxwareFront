import { useGetPermisos } from "@/hooks/permisos/useGetPermisos";
import { usePostPermiso } from "@/hooks/permisos/usePostPermiso";
import { usePutPermiso } from "@/hooks/permisos/usePutPermiso";
import { useDeletePermiso } from "@/hooks/permisos/useDeletePermiso";
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
