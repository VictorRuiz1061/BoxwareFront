import { usePutCentro as useApiPutCentro } from "@/api/centros/putCentro";
import { Centro } from "@/types/centro";

export function usePutCentro() {
  const put = useApiPutCentro();
  const actualizarCentro = async (id: number, data: Partial<Centro>) => put.mutateAsync({ id, ...data });
  return { actualizarCentro };
}
