import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Ficha } from "@/types/ficha";

export type NuevaFicha = Omit<Ficha, "id_ficha">;

export async function postFicha(data: NuevaFicha): Promise<Ficha> {
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