import { useQuery } from "@tanstack/react-query";
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function getHistorialPorUsuario(fechaInicio?: string, fechaFin?: string, usuarioId?: number) {
  try {
    let url = `${API_URL}/informes/historial-por-usuario`;
    const params = new URLSearchParams();
    
    if (fechaInicio) params.append('fechaInicio', fechaInicio);
    if (fechaFin) params.append('fechaFin', fechaFin);
    if (usuarioId !== undefined) params.append('usuarioId', usuarioId.toString());
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error al obtener historial por usuario:', error);
    throw error;
  }
}

export function useGetHistorialPorUsuario(fechaInicio?: string, fechaFin?: string, usuarioId?: number) {
  return useQuery({
    queryKey: ["informes", "historialPorUsuario", fechaInicio, fechaFin, usuarioId],
    queryFn: () => getHistorialPorUsuario(fechaInicio, fechaFin, usuarioId),
    enabled: !!usuarioId
  });
}
