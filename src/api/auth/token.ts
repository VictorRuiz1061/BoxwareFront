import axiosInstance from '../axiosConfig';
import { LoginCredentials, RegisterData, AuthResponse } from '../../types/auth';

// Función genérica para peticiones POST con manejo centralizado de errores
const postRequest = async <T, R>(url: string, data: T): Promise<R> => {
  try {
    const response = await axiosInstance.post<R>(url, data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw error;
    }
    throw new Error('Error al conectar con el servidor');
  }
};

export const login = (credentials: LoginCredentials): Promise<AuthResponse> =>
  postRequest<LoginCredentials, AuthResponse>('/validacion', credentials);

export const register = (userData: RegisterData): Promise<AuthResponse> =>
  postRequest<RegisterData, AuthResponse>('/registrar', userData);
