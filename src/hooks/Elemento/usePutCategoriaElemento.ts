import { usePutCategoriaElemento as useApiPutCategoriaElemento } from "@/api/Elemento/putCategoriaElemento";

export function usePutCategoriaElemento() {
  const mutation = useApiPutCategoriaElemento();
  
  const actualizarCategoriaElemento = async (id: number, data: any) => {
    try {
      await mutation.mutateAsync({ id_categoria: id, data });
      return { success: true };
    } catch (error) {
      console.error("Error al actualizar categoría de elemento:", error);
      return { success: false, error };
    }
  };
  
  return { actualizarCategoriaElemento, isLoading: mutation.isPending };
}
