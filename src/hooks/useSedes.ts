import { useGetSedes } from "@/api/sedes/getSedes";
import { usePostSede } from "@/api/sedes/postSede";
import { usePutSede } from "@/api/sedes/putSede";
import { useDeleteSede } from "@/api/sedes/deleteSede";
import { NuevaSede } from "@/api/sedes/postSede";

export function useSedes() {
  const { data: sedes = [], isLoading: loading } = useGetSedes();
  const post = usePostSede();
  const put = usePutSede();
  const del = useDeleteSede();
  const crearSede = async (data: NuevaSede) => post.mutateAsync(data);
  const actualizarSede = async (id_sede: number, data: NuevaSede) => put.mutateAsync({ ...data, id_sede });
  const eliminarSede = async (id_sede: number) => del.mutateAsync(id_sede);

  return { sedes, loading, crearSede, actualizarSede, eliminarSede };
}
