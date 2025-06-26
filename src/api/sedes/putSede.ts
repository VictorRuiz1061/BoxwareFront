import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Sede } from "@/types/sede";

export async function putSede(data: Partial<Sede> & { id: number }): Promise<Sede> {
  const response = await axiosInstance.put(`/sedes/${data.id}`, data);
  return response.data;
}

export function usePutSede() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: putSede,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sedes"] });
    },
  });
}
