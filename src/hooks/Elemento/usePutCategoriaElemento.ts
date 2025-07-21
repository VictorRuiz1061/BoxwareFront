import { usePutCategoriaElemento as useApiPutCategoriaElemento } from "@/api/Elemento";
import { CategoriaElemento } from "@/types/Elemento";

export function usePutCategoriaElemento() {
  const put = useApiPutCategoriaElemento();
  const actualizarCategoriaElemento = async (id: number, data: CategoriaElemento) => put.mutateAsync({ ...data, id });
  return { actualizarCategoriaElemento };
}
