import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Area } from "@/types/area";

export async function putArea(data: Partial<Area> & { id: number }): Promise<Area> {
  const response = await axiosInstance.put(`/areas/${data.id}`, data);
  return response.data;
}

export function usePutArea() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: putArea,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["areas"] });
    },
  });
}
