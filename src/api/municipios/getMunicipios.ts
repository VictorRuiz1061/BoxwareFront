import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Municipio } from "@/types/municipio";
import { extractArrayData } from "@/utils/responseHandler";

export async function getMunicipios(): Promise<Municipio[]> {
  const response = await axiosInstance.get("/municipios");
  return extractArrayData<Municipio>(response, 'getMunicipios');
}

export function useGetMunicipios() {
  return useQuery<Municipio[]>({
    queryKey: ["municipios"],
    queryFn: getMunicipios,
  });
}
