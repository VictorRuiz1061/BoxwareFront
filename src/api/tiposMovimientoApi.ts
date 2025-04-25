import axiosInstance from './axiosConfig';
import { TipoMovimiento } from '../types/tipoMovimiento';

export const getTiposMovimiento = async (): Promise<TipoMovimiento[]> => {
  const response = await axiosInstance.get<TipoMovimiento[]>('/tipos-movimiento');
  return response.data;
};

export const crearTipoMovimiento = async (tipoMovimiento: Omit<TipoMovimiento, 'id_tipo_movimiento'>): Promise<TipoMovimiento> => {
  const response = await axiosInstance.post<TipoMovimiento>('/tipos-movimiento', tipoMovimiento);
  return response.data;
};

export const actualizarTipoMovimiento = async (id: number, tipoMovimiento: Partial<TipoMovimiento>): Promise<TipoMovimiento> => {
  const response = await axiosInstance.put<TipoMovimiento>(`/tipos-movimiento/${id}`, tipoMovimiento);
  return response.data;
};

export const eliminarTipoMovimiento = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/tipos-movimiento/${id}`);
};
