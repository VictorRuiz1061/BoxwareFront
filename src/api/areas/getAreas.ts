import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Area } from "@/types/area";
import { extractArrayData } from "@/utils/responseHandler";

export async function getAreas(): Promise<Area[]> {
  const response = await axiosInstance.get("/areas");
  return extractArrayData<Area>(response, 'getAreas');
}

export function useGetAreas() {
  return useQuery<Area[]>({
    queryKey: ["areas"],
    queryFn: getAreas,
  });
}
