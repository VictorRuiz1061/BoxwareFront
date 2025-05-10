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
      const response = await apiLogin({ ...values, contrasena: values.password });
      if (response.token) {
        setTokenCookie(response.token);
        navigate('/dashboard');
        return { success: true };
      } else {
        throw new Error(response.message || 'Error al iniciar sesión');
      }
    } catch (error: any) {
      return handleError(error, 'Error al iniciar sesión. Por favor, intenta nuevamente.');
    }
  };

  return { login, validationErrors };
} 