import { usePutSede as useApiPutSede } from "@/api/sedes";
import { Sede } from "@/types";

export function usePutSede() {
  const put = useApiPutSede();
  const actualizarSede = async (id: number, data: Sede) => put.mutateAsync({ ...data, id });
  return { actualizarSede };
}
