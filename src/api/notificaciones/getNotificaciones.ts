import axiosInstance from '../axiosConfig';
import { AxiosError } from 'axios';

export interface Notificacion {
  id_notificacion: number;
  tipo: string;
  nivel: string;
  estado: string;
  titulo: string;
  mensaje: string;
  datos_adicionales?: any;
  material_id?: number;
  sitio_id?: number;
  movimiento_id?: number;
  usuario_id?: number;
  fecha_creacion: string;
  fecha_lectura?: string;
  enviada_websocket: boolean;
}

export interface NotificacionesResponse {
  data: Notificacion[];
  count: number;
  statusCode: number;
  message: string;
}

export const getNotificaciones = async (params?: { take?: number; skip?: number }) => {
  try {
    const response = await axiosInstance.get<NotificacionesResponse>('/notificaciones', { params });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('Error al obtener notificaciones:', axiosError);
    throw axiosError;
  }
};

export const getNotificacionesPendientes = async (usuarioId: number, params?: { take?: number; skip?: number }) => {
  try {
    const queryParams = { 
      ...params,
      estado: 'pendiente'
    };
    const response = await axiosInstance.get<NotificacionesResponse>(`/notificaciones/usuario/${usuarioId}`, { params: queryParams });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('Error al obtener notificaciones pendientes:', axiosError);
    throw axiosError;
  }
};

export const marcarNotificacionComoLeida = async (id: number) => {
  try {
    const response = await axiosInstance.patch(`/notificaciones/${id}/marcar-como-leida`);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('Error al marcar notificación como leída:', axiosError);
    throw axiosError;
  }
};
