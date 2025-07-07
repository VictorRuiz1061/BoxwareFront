import { useQuery } from "@tanstack/react-query";
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function getUsuariosConMasMateriales(limite?: number) {
  try {
    let url = `${API_URL}/informes/usuarios-con-mas-materiales`;
    
    if (limite !== undefined) {
      url += `?limite=${limite}`;
    }
    
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error al obtener usuarios con más materiales:', error);
    throw error;
  }
}

export function useGetUsuariosConMasMateriales(limite?: number) {
  return useQuery({
    queryKey: ["informes", "usuariosConMasMateriales", limite],
    queryFn: () => getUsuariosConMasMateriales(limite)
  });
}
