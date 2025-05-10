import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";

export interface Permiso {
  [x: string]: any;
  id: number;
  nombre: string;
  codigo_nombre: string;
  modulo_id: number;
  rol_id: number;
}

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