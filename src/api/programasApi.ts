import axiosInstance from './axiosConfig';
import { Programa } from '../types/programa';

export const getProgramas = async (): Promise<Programa[]> => {
  const response = await axiosInstance.get<{datos: Programa[]}>('/programa');
  // Manejar el formato específico de respuesta
  if (response.data.datos && Array.isArray(response.data.datos)) {
    return response.data.datos;
  } else {
    throw new Error('Formato de respuesta incorrecto');
  }
};

export const crearPrograma = async (programa: Omit<Programa, 'id_programa'>): Promise<Programa> => {
  const response = await axiosInstance.post<Programa>('/programa', programa);
  return response.data;
};

export const actualizarPrograma = async (id: number, programa: Partial<Programa>): Promise<Programa> => {
  const response = await axiosInstance.put<Programa>(`/programa/${id}`, programa);
  return response.data;
};

export const eliminarPrograma = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/programa/${id}`);
};
