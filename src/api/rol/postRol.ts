import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Rol } from "@/types/rol";

export async function postRol(data: Rol): Promise<Rol> {
  const response = await axiosInstance.post("/roles", data);
  return response.data;
}

export function usePostRol() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postRol,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
}
