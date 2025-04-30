import axiosInstance from './axiosConfig';
import { Material } from '../types/material';
 
export const getMateriales = async (): Promise<Material[]> => {
  const response = await axiosInstance.get<Material[]>('/materiales');
  return response.data;
};

export const crearMaterial = async (material: Omit<Material, 'id_material'>): Promise<Material> => {
  const response = await axiosInstance.post<Material>('/materiales/crear', material);
  return response.data;
};

export const actualizarMaterial = async (id: number, material: Partial<Material>): Promise<Material> => {
  const response = await axiosInstance.put<Material>(`/materiales/actualizar/${id}`, material);
  return response.data;
};

export const eliminarMaterial = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/materiales/eliminar/${id}`);
};
