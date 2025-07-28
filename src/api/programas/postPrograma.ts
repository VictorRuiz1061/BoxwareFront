import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Programa, CreateProgramaRequest } from "@/types";

export async function postPrograma(data: CreateProgramaRequest): Promise<Programa> {
  // Formatear la fecha actual en formato YYYY-MM-DD para PostgreSQL
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const currentDate = formatDate(new Date());

  const response = await axiosInstance.post("/programas", {
    nombre_programa: data.nombre_programa,
    estado: data.estado ? 1 : 0, // Convertir boolean a número
    fecha_creacion: currentDate,
    fecha_modificacion: currentDate,
    area_id: data.area_id
  });
  return response.data.data.data;
}

export function usePostPrograma() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postPrograma,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programas"] });
    },
  });
} 