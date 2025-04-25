import axiosInstance from './axiosConfig';
import { 
  LoginCredentials, 
  RegisterData,
  AuthResponse
} from '../types/auth';

/**
 * Función para iniciar sesión
 */
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post('/validacion', credentials);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw error;
    }
    throw new Error('Error al conectar con el servidor');
  }
};

/**
 * Función para registrar un nuevo usuario
 */
export const register = async (userData: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post('/registrar', userData);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw error;
    }
    throw new Error('Error al conectar con el servidor');
  }
}; 