import { usePutFicha as useApiPutFicha } from "@/api/fichas";
import { Ficha } from "@/types";

export function usePutFicha() {
  const put = useApiPutFicha();
  const actualizarFicha = async (id: number, data: Partial<Ficha>) => put.mutateAsync({ ...data, id });
  return { actualizarFicha };
}