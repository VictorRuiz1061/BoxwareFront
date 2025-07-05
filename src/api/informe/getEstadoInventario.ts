import { useQuery } from "@tanstack/react-query";
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function getEstadoInventario() {
  try {
    const response = await axios.get(`${API_URL}/informes/estado-inventario`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener estado del inventario:', error);
    throw error;
  }
}

export function useGetEstadoInventario() {
  return useQuery({
    queryKey: ["informes", "estadoInventario"],
    queryFn: getEstadoInventario
  });
}
