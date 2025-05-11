import axiosInstance from '../axiosConfig';

export const eliminarMovimiento = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/movimientos/${id}`);
};
