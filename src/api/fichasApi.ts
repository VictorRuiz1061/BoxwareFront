import axiosInstance from './axiosConfig';
import { Ficha } from '../types/ficha';

export const getFichas = async (): Promise<Ficha[]> => {
  try {
    console.log('Realizando petición a /fichas');
    const response = await axiosInstance.get<{mensaje: string, datos: Ficha[]}>('/fichas');
    console.log('Respuesta de la API:', response.data);
    
    if (response.data && response.data.datos) {
      return response.data.datos;
    }
    
    return [];
  } catch (error) {
    console.error('Error al obtener fichas:', error);
    throw error;
  }
};

export const crearFicha = async (ficha: Omit<Ficha, 'id_ficha'>): Promise<Ficha> => {
  const response = await axiosInstance.post<Ficha>('/fichas', ficha);
  return response.data;
};

export const actualizarFicha = async (id: number, ficha: Partial<Ficha>): Promise<Ficha> => {
  const response = await axiosInstance.put<Ficha>(`/fichas/${id}`, ficha);
  return response.data;
};

export const eliminarFicha = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/fichas/${id}`);
};
