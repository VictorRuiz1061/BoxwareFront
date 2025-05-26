import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginFormValues } from '@/types/auth';
import { login as apiLogin } from '@/api/auth/token';

const TOKEN_COOKIE_KEY = 'token';
const setTokenCookie = (token: string, maxAge = 3600) => {
  document.cookie = `${TOKEN_COOKIE_KEY}=${token}; path=/; max-age=${maxAge}; samesite=strict`;
};

export function usePostAuth() {
  const [validationErrors, setValidationErrors] = useState<Record<string, string> | null>(null);
  const navigate = useNavigate();

  const handleError = (error: any, defaultMsg: string) => {
    const errorMessage = error?.response?.data?.message || defaultMsg;
    return { success: false, errors: { general: errorMessage } };
  };

  const login = async (values: LoginFormValues) => {
    setValidationErrors(null);
    try {
      // Crear el payload correcto para el backend (solo contrasena, no password)
      const loginPayload = {
        email: values.email,
        contrasena: values.password // El backend espera 'contrasena', no 'password'
      };
      
      console.log('[Auth] Intentando iniciar sesión con:', { email: loginPayload.email });
      
      const response = await apiLogin(loginPayload);
      console.log('[Auth] Respuesta del servidor:', response);
      
      if (response.token) {
        console.log('[Auth] Token recibido, guardando en cookies');
        setTokenCookie(response.token);
        navigate('/dashboard');
        return { success: true };
      } else {
        console.error('[Auth] No se recibió token en la respuesta:', response);
        throw new Error(response.message || 'Error al iniciar sesión');
      }
    } catch (error: any) {
      console.error('[Auth] Error durante el inicio de sesión:', error.response?.data || error.message);
      return handleError(error, 'Error al iniciar sesión. Por favor, intenta nuevamente.');
    }
  };

  return { login, validationErrors };
}