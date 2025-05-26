import { usePostCategoriaElemento as useApiPostCategoriaElemento } from "@/api/Elemento/postCategoriaElemento";
import { CategoriaElemento } from "@/types/categoriaElemento";

export function usePostCategoriaElemento() {
  const post = useApiPostCategoriaElemento();
  const crearCategoriaElemento = async (data: CategoriaElemento) => post.mutateAsync(data);
  return { crearCategoriaElemento };
}
