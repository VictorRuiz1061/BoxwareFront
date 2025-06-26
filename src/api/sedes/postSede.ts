import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Sede } from "@/types/sede";

export async function postSede(data: Sede): Promise<Sede> {
    const response = await axiosInstance.post("/sedes", data);
    return response.data;
}

export function usePostSede() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postSede,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sedes"] });
    },
  });
}
