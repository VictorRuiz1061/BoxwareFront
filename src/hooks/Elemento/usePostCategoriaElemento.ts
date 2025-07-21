import { usePostCategoriaElemento as useApiPostCategoriaElemento } from "@/api/Elemento";
import { CategoriaElemento } from "@/types/Elemento";

export function usePostCategoriaElemento() {
  const post = useApiPostCategoriaElemento();
  const crearCategoriaElemento = async (data: CategoriaElemento) => post.mutateAsync(data);
  return { crearCategoriaElemento };
}
