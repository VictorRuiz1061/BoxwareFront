import { useGetProgramas } from "@/hooks/programas/useGetProgramas";
import { usePostPrograma } from "@/hooks/programas/usePostPrograma";
import { usePutPrograma } from "@/hooks/programas/usePutPrograma";
import { useDeletePrograma } from "@/hooks/programas/useDeletePrograma";
import { Programa } from "@/types/programa";
import { NuevoPrograma } from "@/api/programas/postPrograma";

export function useProgramas() {
  const { data: programas = [], isLoading: loading } = useGetProgramas();
  const post = usePostPrograma();
  const put = usePutPrograma();
  const del = useDeletePrograma();
  const crearPrograma = async (data: NuevoPrograma) => post.mutateAsync(data);
  const actualizarPrograma = async (id_programa: number, data: Programa) => put.mutateAsync({ ...data, id_programa });
  const eliminarPrograma = async (id_programa: number) => del.mutateAsync(id_programa);

  return { programas, loading, crearPrograma, actualizarPrograma, eliminarPrograma };
}
