import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Centro } from "@/types/centro";
import { extractArrayData } from "@/utils/responseHandler";

export async function getCentros(): Promise<Centro[]> {
  const response = await axiosInstance.get("/centros");
  return extractArrayData<Centro>(response, 'getCentros');
}

export function useGetCentros() {
  return useQuery<Centro[]>({
    queryKey: ["centros"],
    queryFn: getCentros,
  });
}
