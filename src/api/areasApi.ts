import axiosInstance from './axiosConfig';
import { Area } from '../types/area';

export const getAreas = async (): Promise<Area[]> => {
  const response = await axiosInstance.get<Area[]>('/areas');
  return response.data;
};

export const crearArea = async (area: Omit<Area, 'id_area'>): Promise<Area> => {
  const response = await axiosInstance.post<Area>('/areas', area);
  return response.data;
};

export const actualizarArea = async (id: number, area: Partial<Area>): Promise<Area> => {
  const response = await axiosInstance.put<Area>(`/areas/${id}`, area);
  return response.data;
};

export const eliminarArea = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/areas/${id}`);
};
