import { useDeleteMunicipio as useApiDeleteMunicipio } from "@/api/municipios/deleteMunicipio";

export function useDeleteMunicipio() {
  const del = useApiDeleteMunicipio();
  const eliminarMunicipio = async (id_municipio: number) => del.mutateAsync(id_municipio);
  return { eliminarMunicipio };
} 