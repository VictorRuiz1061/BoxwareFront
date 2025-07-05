import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Usuario } from "@/types/usuario";
import { extractObjectData } from "@/utils/responseHandler";

export async function getUsuariosVer(id: number): Promise<Usuario | null> {
  const response = await axiosInstance.get(`/usuarios/${id}`);
  return extractObjectData<Usuario>(response, 'getUsuariosVer');
}

export function useGetUsuariosVer(id: number) {
  return useQuery<Usuario | null>({
    queryKey: ["usuarios", id],
    queryFn: () => getUsuariosVer(id),
  });
}
