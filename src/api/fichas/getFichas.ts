import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Ficha } from "@/types/ficha";

export async function getFichas(): Promise<Ficha[]> {
  try {
    const response = await axiosInstance.get("/fichas");
    console.log('Fichas API response:', response.data);
    
    // Handle different possible response formats
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    } else if (response.data && response.data.datos && Array.isArray(response.data.datos)) {
      return response.data.datos;
    } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
      return response.data.data;
    } else {
      console.error('Unexpected response format:', response.data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching fichas:', error);
    return [];
  }
}

export function useGetFichas() {
  return useQuery<Ficha[]>({
    queryKey: ["fichas"],
    queryFn: getFichas,
  });
} 