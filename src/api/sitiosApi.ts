import { Sitio } from '../types/sitio';
import axios from './axiosConfig';

export const getSitios = async (): Promise<Sitio[]> => {
  const res = await axios.get('/sitios');
  return res.data;
};

export const crearSitio = async (sitio: Omit<Sitio, 'id_sitio'>): Promise<Sitio> => {
  const res = await axios.post('/sitios/crear', sitio);
  return res.data;
};

export const actualizarSitio = async (id: number, sitio: Omit<Sitio, 'id_sitio'>): Promise<Sitio> => {
  const res = await axios.put(`/sitios/actualizar/${id}`, sitio);
  return res.data;
};

export const eliminarSitio = async (id: number): Promise<void> => {
  await axios.delete(`/sitios/eliminar/${id}`);
};
