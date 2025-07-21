import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Programa } from "@/types/programa";
import { extractArrayData } from "@/utils/responseHandler";

export async function getProgramas(): Promise<Programa[]> {
  const response = await axiosInstance.get("/programas");
  return extractArrayData<Programa>(response);
}

export function useGetProgramas() {
  return useQuery<Programa[]>({
    queryKey: ["programas"],
    queryFn: getProgramas,
  });
}
