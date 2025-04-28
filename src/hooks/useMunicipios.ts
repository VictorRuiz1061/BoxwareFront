import { Municipio } from '../types/municipio';
import { useGetMunicipios } from "@/hooks/municipios/useGetMunicipios";
import { usePostMunicipio } from "@/hooks/municipios/usePostMunicipio";
import { usePutMunicipio } from "@/hooks/municipios/usePutMunicipio";
import { useDeleteMunicipio } from "@/hooks/municipios/useDeleteMunicipio";
import { NuevoMunicipio } from "@/api/municipios/postMunicipio";

export function useMunicipios() {
  const { data: municipios = [], isLoading: loading } = useGetMunicipios();
  const post = usePostMunicipio();
  const put = usePutMunicipio();
  const del = useDeleteMunicipio();

  const crearMunicipio = async (data: NuevoMunicipio) => post.mutateAsync(data);
  const actualizarMunicipio = async (id_municipio: number, data: Omit<Municipio, 'id_municipio'>) => put.mutateAsync({ ...data, id_municipio });
  const eliminarMunicipio = async (id_municipio: number) => del.mutateAsync(id_municipio);

  return { municipios, loading, crearMunicipio, actualizarMunicipio, eliminarMunicipio };
}
