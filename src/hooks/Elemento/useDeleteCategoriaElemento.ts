import { useDeleteCategoriaElemento as useApiDeleteCategoriaElemento } from "@/api/Elemento/deleteCategoriaElemento";

export function useDeleteCategoriaElemento() {
  const mutation = useApiDeleteCategoriaElemento();
  
  const eliminarCategoriaElemento = async (id: number) => {
    try {
      await mutation.mutateAsync(id);
      return { success: true };
    } catch (error) {
      console.error("Error al eliminar categoría de elemento:", error);
      return { success: false, error };
    }
  };
  
  return { eliminarCategoriaElemento, isLoading: mutation.isPending };
}
