import { Municipio } from '../types/municipio';
import axios from './axiosConfig';

export const getMunicipios = async (): Promise<Municipio[]> => {
  const res = await axios.get('/municipios');
  return res.data;
};

export const crearMunicipio = async (municipio: Omit<Municipio, 'id_municipio'>): Promise<Municipio> => {
  const res = await axios.post('/municipios/crear', municipio);
  return res.data;
};

export const actualizarMunicipio = async (id: number, municipio: Omit<Municipio, 'id_municipio'>): Promise<Municipio> => {
  const res = await axios.put(`/municipios/actualizar/${id}`, municipio);
  return res.data;
};

export const eliminarMunicipio = async (id: number): Promise<void> => {
  await axios.delete(`/municipios/eliminar/${id}`);
};
