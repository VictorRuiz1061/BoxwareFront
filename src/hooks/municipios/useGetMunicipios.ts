import { useGetMunicipios as useApiGetMunicipios } from "@/api/municipios/getMunicipios";

export function useGetMunicipios() {
  const { data: municipios = [], isLoading: loading } = useApiGetMunicipios();
  return { municipios, loading };
}
