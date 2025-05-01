import { useGetCategoriaElemento } from "@/api/categoriaElemento/getCategoriaElementos";

export function useCategoriaElementoGet() {
  const { data: materiales = [], isLoading: loading } = useGetCategoriaElemento();
  return { materiales, loading };
}