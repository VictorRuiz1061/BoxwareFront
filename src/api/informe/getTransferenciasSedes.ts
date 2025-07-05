import { useQuery } from "@tanstack/react-query";
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function getTransferenciasSedes(fechaInicio?: string, fechaFin?: string) {
  try {
    let url = `${API_URL}/informes/transferencias-sedes`;
    const params = new URLSearchParams();
    
    if (fechaInicio) params.append('fechaInicio', fechaInicio);
    if (fechaFin) params.append('fechaFin', fechaFin);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error al obtener transferencias entre sedes:', error);
    throw error;
  }
}

export function useGetTransferenciasSedes(fechaInicio?: string, fechaFin?: string) {
  return useQuery({
    queryKey: ["informes", "transferenciasSedes", fechaInicio, fechaFin],
    queryFn: () => getTransferenciasSedes(fechaInicio, fechaFin)
  });
}
