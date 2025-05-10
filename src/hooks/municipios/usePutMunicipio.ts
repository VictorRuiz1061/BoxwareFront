import { usePutMunicipio as useApiPutMunicipio } from "@/api/municipios/putMunicipio";
import { Municipio } from "@/types/municipio";

export function usePutMunicipio() {
  const put = useApiPutMunicipio();
  const actualizarMunicipio = async (id_municipio: number, data: Omit<Municipio, 'id_municipio'>) => 
    put.mutateAsync({ ...data, id_municipio });
  return { actualizarMunicipio };
} 