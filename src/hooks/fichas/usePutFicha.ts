import { usePutFicha as useApiPutFicha } from "@/api/fichas/putFicha";
import { Ficha } from "@/types/ficha";

export function usePutFicha() {
  const put = useApiPutFicha();
  const actualizarFicha = async (id_ficha: number, data: Partial<Ficha>) => put.mutateAsync({ id_ficha, ...data } as Ficha & { id_ficha: number });
  return { actualizarFicha };
} 