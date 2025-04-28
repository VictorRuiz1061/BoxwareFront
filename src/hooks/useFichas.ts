import { useGetFichas } from "@/hooks/fichas/useGetFichas";
import { usePostFicha } from "@/hooks/fichas/usePostFicha";
import { usePutFicha } from "@/hooks/fichas/usePutFicha";
import { useDeleteFicha } from "@/hooks/fichas/useDeleteFicha";
import { Ficha } from "@/types/ficha";
import { NuevaFicha } from "@/api/fichas/postFicha";

export function useFichas() {
  const { data: fichas = [], isLoading: loading } = useGetFichas();
  const post = usePostFicha();
  const put = usePutFicha();
  const del = useDeleteFicha();
  const crearFicha = async (data: NuevaFicha) => post.mutateAsync(data);
  const actualizarFicha = async (id_ficha: number, data: Partial<Ficha>) => put.mutateAsync({ id_ficha, ...data } as Ficha & { id_ficha: number });
  const eliminarFicha = async (id_ficha: number) => del.mutateAsync(id_ficha);

  return { fichas, loading, crearFicha, actualizarFicha, eliminarFicha };
}
