import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Municipio } from "@/types/municipio";

export async function getMunicipios(): Promise<Municipio[]> {
  const response = await axiosInstance.get("/municipios");
  return response.data;
}

export function useGetMunicipios() {
  return useQuery<Municipio[]>({
    queryKey: ["municipios"],
    queryFn: getMunicipios,
  });
}
