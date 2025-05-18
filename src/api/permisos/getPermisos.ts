import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Permiso } from "@/types/permiso";

export async function getPermisos(): Promise<Permiso[]> {
  const response = await axiosInstance.get("/permisos");
  return response.data;
}

export function useGetPermisos() {
  return useQuery<Permiso[]>({
    queryKey: ["permisos"],
    queryFn: getPermisos,
  });
} 