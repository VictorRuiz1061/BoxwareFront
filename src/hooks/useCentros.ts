import { useGetCentros } from "@/hooks/centros/useGetCentros";
import { usePostCentro } from "@/hooks/centros/usePostCentro";
import { usePutCentro } from "@/hooks/centros/usePutCentro";
import { useDeleteCentro } from "@/hooks/centros/useDeleteCentro";
import { NuevoCentro } from "@/api/centros/postCentro";
import { CentroUpdate } from "@/api/centros/putCentro";

export function useCentros() {
  const { data: centros = [], isLoading: loading } = useGetCentros();
  const post = usePostCentro();
  const put = usePutCentro();
  const del = useDeleteCentro();

  const crearCentro = async (data: NuevoCentro) => post.mutateAsync(data);
  const actualizarCentro = async (id_centro: number, data: CentroUpdate) => put.mutateAsync({ ...data, id_centro });
  const eliminarCentro = async (id_centro: number) => del.mutateAsync(id_centro);

  return { centros, loading, crearCentro, actualizarCentro, eliminarCentro };
}
