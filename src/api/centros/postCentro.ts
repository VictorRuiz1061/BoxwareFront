import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Centro } from "@/types/centro";

export type NuevoCentro = Omit<Centro, "id_centro">;

export async function postCentro(data: NuevoCentro): Promise<Centro> {
  const response = await axiosInstance.post("/centros", data);
  return response.data;
}

export function usePostCentro() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postCentro,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["centros"] });
    },
  });
} 