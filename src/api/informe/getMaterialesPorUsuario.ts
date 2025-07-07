import { useQuery } from "@tanstack/react-query";
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function getMaterialesPorUsuario() {
  try {
    const response = await axios.get(`${API_URL}/informes/materiales-por-usuario`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener materiales por usuario:', error);
    throw error;
  }
}

export function useGetMaterialesPorUsuario() {
  return useQuery({
    queryKey: ["informes", "materialesPorUsuario"],
    queryFn: getMaterialesPorUsuario
  });
}
