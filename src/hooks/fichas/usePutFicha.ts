import { usePutFicha as useApiPutFicha } from "@/api/fichas/putFicha";
import { Ficha } from "@/types/ficha";

export function usePutFicha() {
  const put = useApiPutFicha();
  const actualizarFicha = async (id: number, data: Ficha) => put.mutateAsync({ ...data, id });
  return { actualizarFicha };
} 