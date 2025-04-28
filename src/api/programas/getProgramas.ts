import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Programa } from "@/types/programa";

export async function getProgramas(): Promise<Programa[]> {
  const response = await axiosInstance.get<{datos: Programa[]}>("/programa");
  if (response.data.datos && Array.isArray(response.data.datos)) {
    return response.data.datos;
  } else {
    throw new Error('Formato de respuesta incorrecto');
  }
}

export function useGetProgramas() {
  return useQuery<Programa[]>({
    queryKey: ["programas"],
    queryFn: getProgramas,
  });
} 