import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Ficha } from "@/types/ficha";

export async function postFicha(data: Ficha): Promise<Ficha> {
  const response = await axiosInstance.post("/fichas", data);
  return response.data;
}

export function usePostFicha() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postFicha,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fichas"] });
    },
  });
}
