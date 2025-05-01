import { useDeletecategoriaElemento } from "@/api/categoriaElemento/deleteCategoriaElemento";

export function useCategoriaElementoDelete() {
  const del = useDeletecategoriaElemento();

  const eliminarMaterial = async (id: number) => del.mutateAsync(id);

  return { eliminarMaterial };
}