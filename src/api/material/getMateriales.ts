import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Material } from "@/types/material";

export async function getMateriales(): Promise<Material[]> {
  const response = await axiosInstance.get("/materiales");
  return response.data;
}

export function useGetMateriales() {
  return useQuery<Material[]>({
    queryKey: ["materiales"],
    queryFn: getMateriales,
  });
}
