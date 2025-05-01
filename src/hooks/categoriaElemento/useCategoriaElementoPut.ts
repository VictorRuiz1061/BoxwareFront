import { usePutCategoriaElementos, CategoriaElementos } from "@/api/categoriaElemento/putCategoriaElemento";

export function useCategoriaElementoPut() {
  const put = usePutCategoriaElementos();

  const actualizarMaterial = async (id: number, data: CategoriaElementos) =>
    put.mutateAsync({ ...data, id_categoria_elemento: id });

  return { actualizarMaterial };
}