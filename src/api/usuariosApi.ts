import axiosInstance from './axiosConfig';
import { Usuario } from '../types/usuario';

export const getUsuarios = async (): Promise<Usuario[]> => {
  const response = await axiosInstance.get<Usuario[]>('/usuarios');
  return response.data;
};

export const crearUsuario = async (usuario: Omit<Usuario, 'id_usuario'>): Promise<Usuario> => {
  const response = await axiosInstance.post<Usuario>('/usuarios', usuario);
  return response.data;
};

export const actualizarUsuario = async (id: number, usuario: Partial<Usuario>): Promise<Usuario> => {
  const response = await axiosInstance.put<Usuario>(`/usuarios/${id}`, usuario);
  return response.data;
};

export const eliminarUsuario = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/usuarios/${id}`);
};
