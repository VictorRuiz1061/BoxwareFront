import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Permiso } from "@/types/permiso";
import { extractArrayData } from "@/utils/responseHandler";

export async function getPermisos(): Promise<Permiso[]> {
  const response = await axiosInstance.get("/permisos");
  return extractArrayData<Permiso>(response, 'getPermisos');
}

export function useGetPermisos() {
  return useQuery<Permiso[]>({
    queryKey: ["permisos"],
    queryFn: getPermisos,
  });
}
