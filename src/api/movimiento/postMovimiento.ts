import axiosInstance from '../axiosConfig';
import { Movimiento } from '../../types/movimiento';

export const crearMovimiento = async (movimiento: Omit<Movimiento, 'id_movimiento'>): Promise<Movimiento> => {
  const response = await axiosInstance.post<Movimiento>('/movimientos', movimiento);
  return response.data;
};

