import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Alerta } from "@/types/alerta";
import { extractObjectData } from "@/utils/responseHandler";

export async function patchAlertaLeer(id: number): Promise<Alerta> {
  const response = await axiosInstance.patch(`/alertas/${id}/leer`);
  const data = extractObjectData<Alerta>(response);
  if (!data) throw new Error('No se pudo marcar la alerta como leída');
  return data;
}

export function usePatchAlertaLeer() {
  const queryClient = useQueryClient();
  
  return useMutation<Alerta, Error, number>({
    mutationFn: patchAlertaLeer,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["alertas"] });
      queryClient.invalidateQueries({ queryKey: ["alerta", id] });
      queryClient.invalidateQueries({ queryKey: ["alertas-estadisticas"] });
    },
  });
} 