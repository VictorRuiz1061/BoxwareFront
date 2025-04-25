import axiosInstance from './axiosConfig';
import { Sede } from '../types/sede';

export const getSedes = async (): Promise<Sede[]> => {
  const response = await axiosInstance.get<Sede[]>('/sedes');
  return response.data;
};

export const crearSede = async (sede: Sede): Promise<Sede> => {
  const response = await axiosInstance.post<Sede>('/sedes', sede);
  return response.data;
};

export const actualizarSede = async (id: number, sede: Partial<Sede>): Promise<Sede> => {
  const response = await axiosInstance.put<Sede>(`/sedes/${id}`, sede);
  return response.data;
};

export const eliminarSede = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/sedes/${id}`);
};
