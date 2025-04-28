import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Rol } from "@/types/rol";

export async function getRoles(): Promise<Rol[]> {
  const response = await axiosInstance.get("/roles");
  return response.data;
}

export function useGetRoles() {
  return useQuery<Rol[]>({
    queryKey: ["roles"],
    queryFn: getRoles,
  });
} 