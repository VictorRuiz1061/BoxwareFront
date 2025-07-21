import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Usuario } from "@/types/usuario";
import { extractArrayData } from "@/utils/responseHandler";

export async function getUsuarios(): Promise<Usuario[]> {
  const response = await axiosInstance.get("/usuarios");
  return extractArrayData<Usuario>(response);
}

export function useGetUsuarios() {
  return useQuery<Usuario[]>({
    queryKey: ["usuarios"],
    queryFn: getUsuarios,
  });
}
