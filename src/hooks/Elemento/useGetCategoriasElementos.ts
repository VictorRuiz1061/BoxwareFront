import { useGetCategoriasElementos as useApiGetCategoriasElementos } from "@/api/Elemento/getCategoriasElementos";

export function useGetCategoriasElementos() {
  const { data: categorias = [], isLoading: loading } = useApiGetCategoriasElementos();
  return { categorias, loading };
}
