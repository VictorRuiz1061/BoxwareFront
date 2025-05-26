import { usePutSede as useApiPutSede } from "@/api/sedes/putSede";
import { Sede } from "@/types/sede";

export function usePutSede() {
  const put = useApiPutSede();
  const actualizarSede = async (id: number, data: Sede) => put.mutateAsync({ ...data, id });
  return { actualizarSede };
}
