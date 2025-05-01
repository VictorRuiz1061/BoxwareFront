import { useGetTipoMaterial } from "@/api/tipoMaterial/getTipoMateria";

export function useTipoMaterialGet() {
  const { data: TipoMateriales = [], isLoading: loading } = useGetTipoMaterial();
  return { TipoMateriales, loading };
}