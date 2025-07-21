import { useGetCategoriasElementos as useApiGetCategoriasElementos } from "@/api/Elemento";

export function useGetCategoriasElementos() {
  const { data: categorias = [], isLoading: loading } = useApiGetCategoriasElementos();
  return { categorias, loading };
}
