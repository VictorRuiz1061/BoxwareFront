import { useGetSitios } from "@/api/sitio/getSitios";
import { usePostSitio } from "@/api/sitio/postSitio";
import { usePutSitio } from "@/api/sitio/putSitio";
import { useDeleteSitio } from "@/api/sitio/deleteSitio";
import { SitioUpdate } from "@/api/sitio/putSitio";
import { Sitio } from "@/types/sitio";


export function useSitio() {
  const { data: Sitioes = [], isLoading: loading } = useGetSitios();
  const post = usePostSitio();
  const put = usePutSitio();
  const del = useDeleteSitio();

  const crearSitio = async (data:Sitio) => post.mutateAsync(data);
  const actualizarSitio = async (id: number, data: SitioUpdate) => put.mutateAsync({ ...data, id_sitio : id });
  const eliminarSitio = async (id: number) => del.mutateAsync(id);

  return { Sitioes, loading, crearSitio, actualizarSitio, eliminarSitio };
}
