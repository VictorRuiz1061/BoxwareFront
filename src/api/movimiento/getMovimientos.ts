import axiosInstance from '../axiosConfig';
import { Movimiento } from '../../types/movimiento';

export const getMovimientos = async (): Promise<Movimiento[]> => {
  const response = await axiosInstance.get<Movimiento[]>('/movimientos');
  return response.data;
};

export const getMovimientoById = async (id: number): Promise<Movimiento> => {
  const response = await axiosInstance.get<Movimiento>(`/movimientos/${id}`);
  return response.data;
};
