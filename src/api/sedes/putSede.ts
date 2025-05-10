import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Sede } from "@/types/sede";

export interface SedeUpdate {
  id_sede: number;
  nombre_sede?: string;
  // otros campos opcionales si es necesario
}

export async function putSede(id: number, data: Partial<Sede>): Promise<Sede> {
  const response = await axiosInstance.put(`/sedes/${id}`, data);
  return response.data;
}

export function usePutSede() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id_sede, ...data }: Sede & { id_sede: number }) => putSede(id_sede, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sedes"] });
    },
  });
} 