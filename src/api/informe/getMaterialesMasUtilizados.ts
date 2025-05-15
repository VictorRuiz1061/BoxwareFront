import { useQuery } from "@tanstack/react-query";
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function getMaterialesMasUtilizados(limite?: number) {
  try {
    let url = `${API_URL}/informes/materiales-mas-utilizados`;
    
    if (limite !== undefined) {
      url += `?limite=${limite}`;
    }
    
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error al obtener materiales más utilizados:', error);
    throw error;
  }
}

export function useGetMaterialesMasUtilizados(limite?: number) {
  return useQuery({
    queryKey: ["informes", "materialesMasUtilizados", limite],
    queryFn: () => getMaterialesMasUtilizados(limite)
  });
}
