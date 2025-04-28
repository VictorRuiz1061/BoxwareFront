import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Area } from "@/types/area";

export type NuevaArea = Omit<Area, "id_area" | "fecha_creacion" | "fecha_modificacion">;

export async function postArea(data: NuevaArea): Promise<Area> {
  const response = await axiosInstance.post("/areas", data);
  return response.data;
}

export function usePostArea() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postArea,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["areas"] });
    },
  });
} 