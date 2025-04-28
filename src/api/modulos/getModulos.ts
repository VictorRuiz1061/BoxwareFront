import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";

export interface Modulo {
  id_modulo: number;
  fecha_accion: string;
  rutas: string;
  descripcion_ruta: string;
  mensaje_cambio: string;
  bandera_accion: string | null;
}

export async function getModulos(): Promise<Modulo[]> {
  const response = await axiosInstance.get("/modulo");
  return response.data;
}

export function useGetModulos() {
  return useQuery<Modulo[]>({
    queryKey: ["modulos"],
    queryFn: getModulos,
  });
} 