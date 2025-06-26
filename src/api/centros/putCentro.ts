import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Centro } from "@/types/centro";

export async function putCentro(data: Partial<Centro> & { id: number }): Promise<Centro> {
    const response = await axiosInstance.put(`/centros/${data.id}`, data);
    return response.data;
}

export function usePutCentro() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: putCentro,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["centros"] });
    },
  });
}
