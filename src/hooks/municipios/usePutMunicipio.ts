import { usePutMunicipio as useApiPutMunicipio } from "@/api/municipios";
import { Municipio } from "@/types";

export function usePutMunicipio() {
  const put = useApiPutMunicipio();
  const actualizarMunicipio = async (id: number, data: Municipio) => put.mutateAsync({ ...data, id });
  return { actualizarMunicipio };
}
