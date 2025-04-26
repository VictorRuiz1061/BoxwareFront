import axiosInstance from './axiosConfig';
import { TipoSitio } from '../types/tipoSitio';

export const getTiposSitio = async (): Promise<TipoSitio[]> => {
  const response = await axiosInstance.get<TipoSitio[]>('/tipos-sitio');
  return response.data;
};

export const crearTipoSitio = async (tipoSitio: Omit<TipoSitio, 'id_tipo_sitio'>): Promise<TipoSitio> => {
  const response = await axiosInstance.post<TipoSitio>('/tipos-sitio', tipoSitio);
  return response.data;
};

export const actualizarTipoSitio = async (id: number, tipoSitio: Partial<TipoSitio>): Promise<TipoSitio> => {
  const response = await axiosInstance.put<TipoSitio>(`/tipos-sitio/${id}`, tipoSitio);
  return response.data;
};

export const eliminarTipoSitio = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/tipos-sitio/${id}`);
};
