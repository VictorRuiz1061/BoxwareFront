import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Material } from "@/types/material";
import { extractArrayData } from "@/utils/responseHandler";

export async function getMateriales(): Promise<Material[]> {
  const response = await axiosInstance.get("/materiales");
  return extractArrayData<Material>(response, 'getMateriales');
}

export function useGetMateriales() {
  return useQuery<Material[]>({
    queryKey: ["materiales"],
    queryFn: getMateriales,
  });
}
 