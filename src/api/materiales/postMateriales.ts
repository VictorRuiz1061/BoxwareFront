import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Material } from "@/types/material";

export async function postMaterial(data: Partial<Material>): Promise<Material> {
    const response = await axiosInstance.post("/materiales", data);
    return response.data;
}

export function usePostMaterial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postMaterial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materiales"] });
    },
  });
}
