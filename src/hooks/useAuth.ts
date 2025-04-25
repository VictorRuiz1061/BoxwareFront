import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {  LoginFormValues, RegisterFormValues, AuthState } from '../types/auth';
import { login as apiLogin, register as apiRegister } from '../api/authApi';
import { z } from 'zod';

// Key para almacenar el token en localStorage
const AUTH_TOKEN_KEY = 'boxware_auth_token';

// Esquema de validación para inicio de sesión
const loginSchema = z.object({
  email: z.string()
    .email({ message: 'Ingresa un correo electrónico válido' })
    .min(1, { message: 'El correo electrónico es requerido' }),
  password: z.string()
    .min(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
});

// Esquema de validación para registro
const registerSchema = z.object({
  nombre: z.string()
    .min(2, { message: 'El nombre debe tener al menos 2 caracteres' })
    .max(50, { message: 'El nombre no debe exceder los 50 caracteres' }),
  apellido: z.string()
    .min(2, { message: 'El apellido debe tener al menos 2 caracteres' })
    .max(50, { message: 'El apellido no debe exceder los 50 caracteres' }),
  edad: z.string()
    .refine(val => !isNaN(Number(val)), { message: 'La edad debe ser un número' })
    .refine(val => Number(val) >= 18, { message: 'Debes ser mayor de 18 años' })
    .optional(),
  cedula: z.string()
    .min(5, { message: 'La cédula debe tener al menos 5 caracteres' })
    .max(15, { message: 'La cédula no debe exceder los 15 caracteres' }),
  email: z.string()
    .email({ message: 'Ingresa un correo electrónico válido' }),
  telefono: z.string()
    .min(7, { message: 'El teléfono debe tener al menos 7 caracteres' })
    .max(15, { message: 'El teléfono no debe exceder los 15 caracteres' })
    .optional(),
  password: z.string()
    .min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
  confirmPassword: z.string()
    .min(1, { message: 'Confirma tu contraseña' })
}).refine(data => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword']
});

// Función para validar con Zod
const validateAuth = <T>(schema: z.ZodType<T>, data: any): { success: true; data: T } | { success: false; errors: Record<string, string> } => {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        if (err.path.length > 0) {
          const key = err.path[0].toString();
          errors[key] = err.message;
        }
      });
      return { success: false, errors };
    }
    return {
      success: false,
      errors: { general: 'Error de validación desconocido' },
    };
  }
};

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
    error: null
  });
  
  const [validationErrors, setValidationErrors] = useState<Record<string, string> | null>(null);
  const navigate = useNavigate();

  // Verificar si hay un usuario autenticado al cargar
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (!token) {
        setAuthState({
          isAuthenticated: false,
          user: null,
          loading: false,
          error: null
        });
        return;
      }

      try {
        // Eliminamos la simulación que automáticamente establece isAuthenticated a true
        // En su lugar, limpiamos el localStorage para forzar un nuevo inicio de sesión
        localStorage.removeItem(AUTH_TOKEN_KEY);
        setAuthState({
          isAuthenticated: false,
          user: null,
          loading: false,
          error: null
        });
      } catch (error) {
        // Si hay un error, el token podría ser inválido
        localStorage.removeItem(AUTH_TOKEN_KEY);
        setAuthState({
          isAuthenticated: false,
          user: null,
          loading: false,
          error: 'Sesión expirada. Por favor, inicia sesión nuevamente.'
        });
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (values: LoginFormValues) => {
    // Validar datos primero
    setValidationErrors(null);
    const validation = validateAuth(loginSchema, values);
    if (!validation.success) {
      setValidationErrors(validation.errors);
      setAuthState(prev => ({ 
        ...prev, 
        error: 'Por favor, corrige los errores en el formulario.' 
      }));
      return { success: false, errors: validation.errors };
    }

    const { email, password } = validation.data;
    setAuthState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await apiLogin({ 
        email,
        contrasena: password 
      });

      if (response.token) {
        localStorage.setItem(AUTH_TOKEN_KEY, response.token);
        setAuthState({
          isAuthenticated: true,
          user: response.user || null,
          loading: false,
          error: null
        });
        navigate('/dashboard');
        return { success: true };
      } else {
        throw new Error(response.message || 'Error de autenticación');
      }
    } catch (error: any) {
      const errorMessage = 
        error.response?.status === 401 
          ? 'Correo electrónico o contraseña incorrectos' 
          : 'Error al iniciar sesión. Por favor, intenta nuevamente.';
      
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: errorMessage
      });
      return { success: false, errors: { general: errorMessage } };
    }
  };

  const register = async (values: RegisterFormValues) => {
    // Validar datos primero
    setValidationErrors(null);
    const validation = validateAuth(registerSchema, values);
    if (!validation.success) {
      setValidationErrors(validation.errors);
      setAuthState(prev => ({ 
        ...prev, 
        error: 'Por favor, corrige los errores en el formulario.' 
      }));
      return { success: false, errors: validation.errors };
    }

    const {
      nombre,
      apellido,
      edad,
      cedula,
      email,
      telefono,
      password,
    } = validation.data;

    setAuthState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await apiRegister({
        nombre,
        apellido,
        edad: edad ? parseInt(String(edad)) : null,
        cedula,
        email,
        contrasena: password,
        telefono,
      });

      if (response.token) {
        localStorage.setItem(AUTH_TOKEN_KEY, response.token);
        setAuthState({
          isAuthenticated: true,
          user: response.user || null,
          loading: false,
          error: null
        });
        navigate('/dashboard');
        return { success: true };
      } else {
        throw new Error(response.message || 'Error al registrar usuario');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al registrar usuario. Por favor, intenta nuevamente.';
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: errorMessage
      });
      return { success: false, errors: { general: errorMessage } };
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setAuthState({
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null
    });
    navigate('/iniciosesion');
  }, [navigate]);

  // Función auxiliar para mostrar mensajes de error
  const mostrarErrores = () => {
    if (!validationErrors) return null;
    
    let mensaje = 'Errores de validación:\n';
    Object.entries(validationErrors).forEach(([campo, error]) => {
      mensaje += `- ${campo}: ${error}\n`;
    });
    
    return mensaje;
  };

  return {
    ...authState,
    validationErrors,
    mostrarErrores,
    login,
    register,
    logout,
    setError: (error: string | null) => 
      setAuthState(prev => ({ ...prev, error }))
  };
};
