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
      // Formato de fecha ISO para el backend
      const now = new Date().toISOString();
      
      // Payload con el formato exacto que espera el backend
      const payload = {
        nombre: values.nombre,
        apellido: values.apellido,
        edad: values.edad ? Number(values.edad) : null,
        cedula: values.cedula,
        email: values.email,
        contrasena: values.password, // El backend espera 'contrasena', no 'password'
        telefono: values.telefono,
        estado: true,
        fecha_registro: now,
        rol_id: 1, // Rol por defecto (usuario normal)
      };
      
      console.log('Enviando datos de registro:', payload);
      
      const response = await apiRegister(payload);
      console.log('Respuesta del servidor:', response);
      
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