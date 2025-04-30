import axiosInstance from './axiosConfig';
import { Movimiento } from '../types/movimiento';

export const getMovimientos = async (): Promise<Movimiento[]> => {
  const response = await axiosInstance.get<Movimiento[]>('/movimientos');
  return response.data;
};

export const crearMovimiento = async (movimiento: Omit<Movimiento, 'id_movimiento'>): Promise<Movimiento> => {
  const response = await axiosInstance.post<Movimiento>('/movimientos', movimiento);
  return response.data;
};

export const actualizarMovimiento = async (id: number, movimiento: Partial<Movimiento>): Promise<Movimiento> => {
  const response = await axiosInstance.put<Movimiento>(`/movimientos/${id}`, movimiento);
  return response.data;
};

export const eliminarMovimiento = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/movimientos/${id}`);
};
