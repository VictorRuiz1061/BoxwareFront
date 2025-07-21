import { useGetMunicipios as useApiGetMunicipios } from "@/api/municipios";

export function useGetMunicipios() {
  const { data: municipios = [], isLoading: loading } = useApiGetMunicipios();
  return { municipios, loading };
}
