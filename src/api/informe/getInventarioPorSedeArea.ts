import { useQuery } from "@tanstack/react-query";
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function getInventarioPorSedeArea() {
  try {
    const response = await axios.get(`${API_URL}/informes/inventario-por-sede-area`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener inventario por sede y área:', error);
    throw error;
  }
}

export function useGetInventarioPorSedeArea() {
  return useQuery({
    queryKey: ["informes", "inventarioPorSedeArea"],
    queryFn: getInventarioPorSedeArea
  });
}
