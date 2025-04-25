import axiosInstance from './axiosConfig';
import { Rol } from '../types/rol';

export const getRoles = async (): Promise<Rol[]> => {
  const response = await axiosInstance.get<Rol[]>('/roles');
  return response.data;
};

export const crearRol = async (rol: Omit<Rol, 'id_rol'>): Promise<Rol> => {
  const response = await axiosInstance.post<Rol>('/roles', rol);
  return response.data;
};

export const actualizarRol = async (id: number, rol: Partial<Rol>): Promise<Rol> => {
  const response = await axiosInstance.put<Rol>(`/roles/${id}`, rol);
  return response.data;
};

export const eliminarRol = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/roles/${id}`);
};
