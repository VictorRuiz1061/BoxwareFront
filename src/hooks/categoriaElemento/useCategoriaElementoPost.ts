import { usePostCategoriaElemento } from "@/api/categoriaElemento/postCategoriaElemento";
import { CategoriaElemento } from "@/types/categoriaElemento";

export function useCategoriaElementoPost() {
  const post = usePostCategoriaElemento();

  const crearMaterial = async (data: CategoriaElemento) => post.mutateAsync(data);

  return { crearMaterial };
}