import { usePutCategoriaElemento as useApiPutCategoriaElemento } from "@/api/Elemento/putCategoriaElemento";
import { CategoriaElemento } from "@/types/categoriaElemento";

export function usePutCategoriaElemento() {
  const put = useApiPutCategoriaElemento();
  const actualizarCategoriaElemento = async (id: number, data: CategoriaElemento) => put.mutateAsync({ ...data, id });
  return { actualizarCategoriaElemento };
}
