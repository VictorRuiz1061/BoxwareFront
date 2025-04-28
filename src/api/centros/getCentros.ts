import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Centro } from "@/types/centro";

export async function getCentros(): Promise<Centro[]> {
  const response = await axiosInstance.get("/centros");
  return response.data;
}

export function useGetCentros() {
  return useQuery<Centro[]>({
    queryKey: ["centros"],
    queryFn: getCentros,
  });
} 