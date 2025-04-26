import axiosInstance from './axiosConfig';
import { Modulo } from '../types/modulo';

export const getModulos = async (): Promise<Modulo[]> => {
  const response = await axiosInstance.get<Modulo[]>('/modulo');
  return response.data;
};

export const crearModulo = async (modulo: Omit<Modulo, 'id_modulo'>): Promise<Modulo> => {
  const response = await axiosInstance.post<Modulo>('/modulo', modulo);
  return response.data;
};

export const actualizarModulo = async (id: number, modulo: Partial<Modulo>): Promise<Modulo> => {
  const response = await axiosInstance.put<Modulo>(`/modulo/${id}`, modulo);
  return response.data;
};

export const eliminarModulo = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/modulo/${id}`);
};
