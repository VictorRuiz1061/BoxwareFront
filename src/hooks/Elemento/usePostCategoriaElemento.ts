import { usePostCategoriaElemento as useApiPostCategoriaElemento } from "@/api/Elemento/postCategoriaElemento";

export function usePostCategoriaElemento() {
  const mutation = useApiPostCategoriaElemento();
  
  const crearCategoriaElemento = async (data: any) => {
    try {
      await mutation.mutateAsync(data);
      return { success: true };
    } catch (error) {
      console.error("Error al crear categoría de elemento:", error);
      return { success: false, error };
    }
  };
  
  return { crearCategoriaElemento, isLoading: mutation.isPending };
}
