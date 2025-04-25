import { Centro } from '../types/centro';
import axios from './axiosConfig';

export const getCentros = async (): Promise<Centro[]> => {
  const res = await axios.get('/centros');
  return res.data;
};

export const crearCentro = async (centro: Centro): Promise<Centro> => {
  const res = await axios.post('/centros', centro);
  return res.data;
};

export const actualizarCentro = async (id: number, centro: Partial<Centro>): Promise<Centro> => {
  const res = await axios.put(`/centros/${id}`, centro);
  return res.data;
};

export const eliminarCentro = async (id: number): Promise<void> => {
  await axios.delete(`/centros/${id}`);
};
