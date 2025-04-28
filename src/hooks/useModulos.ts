import { useGetModulos } from "@/hooks/modulos/useGetModulos";
import { usePostModulo } from "@/hooks/modulos/usePostModulo";
import { usePutModulo } from "@/hooks/modulos/usePutModulo";
import { useDeleteModulo } from "@/hooks/modulos/useDeleteModulo";
import { ModuloUpdate } from "@/api/modulos/putModulo";
import { NuevoModulo } from "@/api/modulos/postModulo";

export function useModulos() {
  const { data: modulos = [], isLoading: loading } = useGetModulos();
  const post = usePostModulo();
  const put = usePutModulo();
  const del = useDeleteModulo();

  const crearModulo = async (data: NuevoModulo) => post.mutateAsync(data);
  const actualizarModulo = async (id: number, data: ModuloUpdate) => put.mutateAsync({ ...data, id });
  const eliminarModulo = async (id: number) => del.mutateAsync(id);

  return {
    modulos,
    loading,
    crearModulo,
    actualizarModulo,
    eliminarModulo,
  };
}
