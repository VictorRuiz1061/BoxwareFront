import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RegisterFormValues } from '@/types/auth';
import { register as apiRegister } from '@/api/auth/token';

const TOKEN_COOKIE_KEY = 'token';
const setTokenCookie = (token: string, maxAge = 3600) => {
  document.cookie = `${TOKEN_COOKIE_KEY}=${token}; path=/; max-age=${maxAge}; samesite=strict`;
};

export function useRegisterAuth() {
  const [validationErrors, setValidationErrors] = useState<Record<string, string> | null>(null);
  const navigate = useNavigate();

  const handleError = (error: any, defaultMsg: string) => {
    const errorMessage = error?.response?.data?.message || defaultMsg;
    return { success: false, errors: { general: errorMessage } };
  };

  const register = async (values: RegisterFormValues) => {
    setValidationErrors(null);
    try {
      const now = new Date().toISOString();
      const payload = {
        nombre: values.nombre,
        apellido: values.apellido,
        edad: values.edad ? Number(values.edad) : undefined,
        cedula: values.cedula,
        email: values.email,
        contrasena: values.password,
        telefono: values.telefono,
        inicio_sesion: now,
        esta_activo: true,
        fecha_registro: now,
        rol_id: 1,
      };
      const response = await apiRegister(payload);
      if (response.token) {
        setTokenCookie(response.token);
        navigate('/dashboard');
        return { success: true };
      } else if (
        response.message &&
        response.message.toLowerCase().includes('usuario registrado exitosamente')
      ) {
        navigate('/dashboard');
        return { success: true };
      } else {
        throw new Error(response.message || 'Error al registrar usuario');
      }
    } catch (error: any) {
      return handleError(error, 'Error al registrar usuario. Por favor, intenta nuevamente.');
    }
  };

  return { register, validationErrors };
} 