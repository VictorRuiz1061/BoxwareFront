import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Programa } from "@/types/programa";

export async function getProgramas(): Promise<Programa[]> {
  const response = await axiosInstance.get("/programas");
  return response.data;
}

export function useGetProgramas() {
  return useQuery<Programa[]>({
    queryKey: ["programas"],
    queryFn: getProgramas,
  });
}
