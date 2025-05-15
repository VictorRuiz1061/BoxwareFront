import { useQuery } from "@tanstack/react-query";
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function getMaterialesBaja() {
  try {
    const response = await axios.get(`${API_URL}/informes/materiales-baja`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener materiales dados de baja:', error);
    throw error;
  }
}

export function useGetMaterialesBaja() {
  return useQuery({
    queryKey: ["informes", "materialesBaja"],
    queryFn: getMaterialesBaja
  });
}
