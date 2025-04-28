import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginFormValues, RegisterFormValues, AuthState } from '../types/auth';
import { login as apiLogin, register as apiRegister } from '../api/authApi';
import { jwtDecode } from 'jwt-decode';

// Utilidad para manejar el token en cookies
const TOKEN_COOKIE_KEY = 'token';
const setTokenCookie = (token: string, maxAge = 3600) => {
  document.cookie = `${TOKEN_COOKIE_KEY}=${token}; path=/; max-age=${maxAge}; samesite=strict`;
};
const removeTokenCookie = () => {
  document.cookie = `${TOKEN_COOKIE_KEY}=; path=/; max-age=0; samesite=strict`;
};
const getTokenFromCookie = (): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${TOKEN_COOKIE_KEY}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

// Utilidad para construir el estado inicial
const initialAuthState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: true,
  error: null,
};

function isTokenValid(token: string | null): boolean {
  if (!token) return false;
  try {
    const decoded: any = jwtDecode(token);
    if (!decoded.exp) return false;
    const now = Date.now() / 1000;
    return decoded.exp > now;
  } catch {
    return false;
  }
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);
  const [validationErrors, setValidationErrors] = useState<Record<string, string> | null>(null);
  const navigate = useNavigate();

  // Verificar autenticación al cargar
  useEffect(() => {
    const token = getTokenFromCookie();
    const valid = isTokenValid(token);
    console.log('[Auth] Token leído:', token);
    console.log('[Auth] ¿Token válido?:', valid);
    setAuthState((prev) => ({
      ...prev,
      isAuthenticated: valid,
      loading: false,
      error: !valid && token ? 'Tu sesión ha expirado o el token es inválido. Por favor, inicia sesión nuevamente.' : null,
    }));
    if (token && !valid) {
      console.log('[Auth] Token inválido o expirado. Eliminando cookie.');
      removeTokenCookie();
    }
  }, []);

  // Manejo centralizado de errores
  const handleError = (error: any, defaultMsg: string) => {
    const errorMessage = error?.response?.data?.message || defaultMsg;
    setAuthState((prev) => ({
      ...prev,
      isAuthenticated: false,
      user: null,
      loading: false,
      error: errorMessage,
    }));
    return { success: false, errors: { general: errorMessage } };
  };

  // Login
  const login = async (values: LoginFormValues) => {
    setValidationErrors(null);
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await apiLogin({ ...values, contrasena: values.password });
      if (response.token) {
        setTokenCookie(response.token);
        setAuthState({
          isAuthenticated: true,
          user: response.user || null,
          loading: false,
          error: null,
        });
        navigate('/dashboard');
        return { success: true };
      } else {
        throw new Error(response.message || 'Error al iniciar sesión');
      }
    } catch (error: any) {
      return handleError(error, 'Error al iniciar sesión. Por favor, intenta nuevamente.');
    }
  };

  // Registro
  const register = async (values: RegisterFormValues) => {
    setValidationErrors(null);
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));
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
        setAuthState({
          isAuthenticated: true,
          user: response.user || null,
          loading: false,
          error: null,
        });
        navigate('/dashboard');
        return { success: true };
      } else if (
        response.message &&
        response.message.toLowerCase().includes('usuario registrado exitosamente')
      ) {
        setAuthState((prev) => ({ ...prev, loading: false, error: null }));
        navigate('/dashboard');
        return { success: true };
      } else {
        throw new Error(response.message || 'Error al registrar usuario');
      }
    } catch (error: any) {
      return handleError(error, 'Error al registrar usuario. Por favor, intenta nuevamente.');
    }
  };

  // Logout
  const logout = useCallback(() => {
    removeTokenCookie();
    setAuthState({ ...initialAuthState, loading: false });
    navigate('/iniciosesion');
  }, [navigate]);

  // Mostrar errores de validación
  const mostrarErrores = () => {
    if (!validationErrors) return null;
    let mensaje = 'Errores de validación:\n';
    Object.entries(validationErrors).forEach(([campo, error]) => {
      mensaje += `- ${campo}: ${error}\n`;
    });
    return mensaje;
  };

  // Permitir setear error manualmente
  const setError = (error: string | null) => setAuthState((prev) => ({ ...prev, error }));

  return {
    ...authState,
    validationErrors,
    mostrarErrores,
    login,
    register,
    logout,
    setError,
    getTokenFromCookie, // Exporta la utilidad si se necesita en otros hooks/componentes
  };
};
