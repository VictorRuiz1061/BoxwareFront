import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Area } from "@/types/area";

export async function getAreas(): Promise<Area[]> {
  const response = await axiosInstance.get("/areas");
  return response.data;
}

export function useGetAreas() {
  return useQuery<Area[]>({
    queryKey: ["areas"],
    queryFn: getAreas,
  });
} 