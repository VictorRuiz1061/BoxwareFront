import axiosInstance from './axiosConfig';
import { CategoriaElemento } from '../types/categoriaElemento';

export const getCategoriasElementos = async (): Promise<CategoriaElemento[]> => {
  const response = await axiosInstance.get<CategoriaElemento[]>('/categorias_elementos');
  return response.data;
};

export const crearCategoriaElemento = async (categoria: Omit<CategoriaElemento, 'id_categoria_elemento'>): Promise<CategoriaElemento> => {
  const response = await axiosInstance.post<CategoriaElemento>('/categorias_elementos/crear', categoria);
  return response.data;
};

export const actualizarCategoriaElemento = async (id: number, categoria: Partial<CategoriaElemento>): Promise<CategoriaElemento> => {
  const response = await axiosInstance.put<CategoriaElemento>(`/categorias_elementos/actualizar/${id}`, categoria);
  return response.data;
};

export const eliminarCategoriaElemento = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/categorias_elementos/eliminar/${id}`);
};
