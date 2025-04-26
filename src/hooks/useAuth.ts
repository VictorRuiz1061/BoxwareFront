import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {  LoginFormValues, RegisterFormValues, AuthState } from '../types/auth';
import { login as apiLogin, register as apiRegister } from '../api/authApi';

// Key para almacenar el token en localStorage
const AUTH_TOKEN_KEY = 'boxware_auth_token';

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
    setValidationErrors(null);
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await apiLogin({...values, contrasena: values.password});
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
        throw new Error(response.message || 'Error al iniciar sesión');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al iniciar sesión. Por favor, intenta nuevamente.';
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
    setValidationErrors(null);
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
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
        rol_id: 1
      };
      const response = await apiRegister(payload);
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
      } else if (
        response.message &&
        response.message.toLowerCase().includes('usuario registrado exitosamente')
      ) {
        // Registro exitoso sin token, redirige a dashboard
        setAuthState(prev => ({
          ...prev,
          loading: false,
          error: null
        }));
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
