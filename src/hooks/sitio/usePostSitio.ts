import { usePostSitio as useApiPostSitio } from "@/api/sitio/postSitio";

export function usePostSitio() {
  const mutation = useApiPostSitio();
  
  const crearSitio = async (data: any) => {
    try {
      await mutation.mutateAsync(data);
      return { success: true };
    } catch (error) {
      console.error("Error al crear sitio:", error);
      return { success: false, error };
    }
  };
  
  return { crearSitio, isLoading: mutation.isPending };
}
