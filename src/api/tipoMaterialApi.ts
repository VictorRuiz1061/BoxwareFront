import axiosInstance from './axiosConfig';
import { TipoMaterial } from '../types/tipoMaterial';

export const getTipoMateriales = async (): Promise<TipoMaterial[]> => {
  const response = await axiosInstance.get<TipoMaterial[]>('/tipoMaterial');
  return response.data;
};

export const crearTipoMaterial = async (tipoMaterial: Omit<TipoMaterial, 'id_tipo_material'>): Promise<TipoMaterial> => {
  const response = await axiosInstance.post<TipoMaterial>('/tipoMaterial/crear', tipoMaterial);
  return response.data;
};

export const actualizarTipoMaterial = async (id: number, tipoMaterial: Partial<TipoMaterial>): Promise<TipoMaterial> => {
  const response = await axiosInstance.put<TipoMaterial>(`/tipoMaterial/actualizar/${id}`, tipoMaterial);
  return response.data;
};

export const eliminarTipoMaterial = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/tipoMaterial/eliminar/${id}`);
};
