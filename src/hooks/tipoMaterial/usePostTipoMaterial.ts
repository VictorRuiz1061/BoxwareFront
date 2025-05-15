import { usePostTipoMaterial as useApiPostTipoMaterial } from "@/api/tipoMaterial/postTipoMaterial";

export function usePostTipoMaterial() {
  const mutation = useApiPostTipoMaterial();
  
  const crearTipoMaterial = async (data: any) => {
    try {
      await mutation.mutateAsync(data);
      return { success: true };
    } catch (error) {
      console.error("Error al crear tipo de material:", error);
      return { success: false, error };
    }
  };
  
  return { crearTipoMaterial, isLoading: mutation.isPending };
}
