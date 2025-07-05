import { useQuery } from "@tanstack/react-query";
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function getMaterialesStockMinimo(stockMinimo?: number) {
  try {
    let url = `${API_URL}/informes/materiales-stock-minimo`;
    
    if (stockMinimo !== undefined) {
      url += `?stockMinimo=${stockMinimo}`;
    }
    
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error al obtener materiales con stock mínimo:', error);
    throw error;
  }
}

export function useGetMaterialesStockMinimo(stockMinimo?: number) {
  return useQuery({
    queryKey: ["informes", "materialesStockMinimo", stockMinimo],
    queryFn: () => getMaterialesStockMinimo(stockMinimo)
  });
}
