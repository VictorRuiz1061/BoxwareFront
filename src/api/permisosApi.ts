import axiosInstance from './axiosConfig';
import { Permiso } from '../types/permiso';

export const getPermisos = async (): Promise<Permiso[]> => {
  const response = await axiosInstance.get<Permiso[]>('/permisos');
  return response.data;
};

export const crearPermiso = async (permiso: Permiso): Promise<Permiso> => {
  const response = await axiosInstance.post<Permiso>('/permisos', permiso);
  return response.data;
};

export const actualizarPermiso = async (id: number, permiso: Partial<Permiso>): Promise<Permiso> => {
  const response = await axiosInstance.put<Permiso>(`/permisos/${id}`, permiso);
  return response.data;
};

export const eliminarPermiso = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/permisos/${id}`);
};
