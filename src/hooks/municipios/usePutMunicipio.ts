import { usePutMunicipio as useApiPutMunicipio } from "@/api/municipios/putMunicipio";
import { Municipio } from "@/types/municipio";

export function usePutMunicipio() {
  const put = useApiPutMunicipio();
  const actualizarMunicipio = async (id: number, data: Municipio) => put.mutateAsync({ ...data, id });
  return { actualizarMunicipio };
}
