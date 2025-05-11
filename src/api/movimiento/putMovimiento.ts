import axiosInstance from '../axiosConfig';
import { Movimiento } from '../../types/movimiento';

export const actualizarMovimiento = async (id: number, movimiento: Partial<Movimiento>): Promise<Movimiento> => {
  const response = await axiosInstance.patch<Movimiento>(`/movimientos/${id}`, movimiento);
  return response.data;
};
