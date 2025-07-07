import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Inventario } from "@/types";

export async function postInventario(data: Inventario): Promise<Inventario> {
  const response = await axiosInstance.post("/inventario", data);
  return response.data;
}

export function usePostInventario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postInventario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventario"] });
    },
  });
}
