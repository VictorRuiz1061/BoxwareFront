import axiosInstance from '../axiosConfig';
import { LoginCredentials, RegisterData, AuthResponse } from '@/types/auth';
// No necesitamos importar extractObjectData ya que ahora procesamos la respuesta directamente

const TOKEN_KEY = 'token';

export const setTokenCookie = (token: string, maxAge = 86400) => {
  document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=${maxAge}; samesite=strict`;
};

const postRequest = async <T, R>(url: string, data: T): Promise<R> => {
  try {
    const response = await axiosInstance.post<R>(url, data);
    return response.data;
  } catch (error: any) {
    if (error.response) throw error;
    throw new Error('Error al conectar con el servidor');
  }
};

// Interfaz para el usuario en la respuesta de la API
interface ApiUser {
  id_usuario: number;
  nombre: string;
  apellido: string;
  email: string;
  imagen?: string;
  rol?: any;
  rol_id?: number;
  [key: string]: any; // Para otras propiedades que pueda tener
}

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    // Intentar con el endpoint /validacion (según la memoria confirmada)
    const apiResponse = await postRequest<LoginCredentials, any>('/validacion', credentials);
    
    // Extraer los datos de la estructura anidada
    // Basado en la respuesta de Postman, la estructura es:
    // { data: { data: [...usuarios], statusCode, message, timestamp }, statusCode, message, timestamp }
    
    let token = '';
    let user = null;
    
    // Manejar diferentes estructuras de respuesta posibles
    if (apiResponse.token) {
      // Estructura simple
      token = apiResponse.token;
      user = apiResponse.user;
    } else if (apiResponse.data?.token) {
      // Estructura anidada en data
      token = apiResponse.data.token;
      user = apiResponse.data.user;
    }
    
    if (!token || !user) {
      throw new Error('Formato de respuesta inválido');
    }
    
    // Guardar el token en una cookie
    setTokenCookie(token);
    
    // Verificar si el usuario tiene la información completa (incluyendo imagen)
    // Si no tiene imagen, intentar buscar el usuario completo en la API
    if (!user.imagen && (user.id || user.id_usuario)) {
      try {
        const userId = user.id || user.id_usuario;
        
        // Obtener el usuario completo desde la API
        const response = await axiosInstance.get(`/usuarios/${userId}`);
        
        // La estructura de la respuesta es { data: { data: [usuario], ... }, ... }
        if (response.data?.data?.data && Array.isArray(response.data.data.data) && response.data.data.data.length > 0) {
          const completeUser = response.data.data.data.find((u: ApiUser) => u.id_usuario === userId);
          if (completeUser) {
            user = completeUser;
          }
        }
      } catch (error) {
      }
    }
    
    // Asegurarnos de que el usuario tenga todos los campos necesarios
    const processedUser = {
      ...user,
      // Asegurarnos de que tenga un campo imagen si no lo tiene
      imagen: user.imagen || '/assets/default.jpg'
    };
    
    localStorage.setItem('user', JSON.stringify(processedUser));
    
    // Crear la respuesta final
    const response: AuthResponse = {
      message: apiResponse.message || 'Operación exitosa',
      token: token,
      user: processedUser
    };
    
    return response;
  } catch (error) {
    throw error;
  }
};

export const register = async (userData: RegisterData): Promise<AuthResponse> => {
  const response = await postRequest<RegisterData, AuthResponse>('/registrar', userData);

  if (response.token) {
    setTokenCookie(response.token);
  }

  return response;
};

export const hasValidToken = (): boolean => {
  const cookie = document.cookie.split('; ').find(c => c.startsWith(`${TOKEN_KEY}=`));
  const token = cookie?.split('=')[1];
  if (!token) return false;

  try {
    const [, payloadBase64] = token.split('.');
    const payload = JSON.parse(atob(payloadBase64));
    return !!payload.exp && payload.exp > Date.now() / 1000;
  } catch (e) {
    return false;
  }
};
