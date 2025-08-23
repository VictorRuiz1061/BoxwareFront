// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserAuth, AuthState } from '@/types/auth';
import { hasValidToken } from '@/api/auth/token';
import { getJsonCookie, setJsonCookie, deleteCookie } from '@/api/axiosConfig';

// Definir el tipo para el contexto
interface AuthContextType {
  authState: AuthState;
  setUser: (user: UserAuth | null) => void;
  
  setIsAuthenticated: (value: boolean) => void;
  logout: () => void;
}


// Crear el contexto con un valor inicial
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personalizado para usar el contexto
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext debe ser usado dentro de un AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
    error: null,
  });

  // Verificar autenticación al cargar
  useEffect(() => {
    const checkAuth = () => {
      try {
        const isValid = hasValidToken();
        // Recuperar la información del usuario desde cookies
        const user = getJsonCookie<UserAuth>('user');
        
        setAuthState({
          isAuthenticated: isValid && !!user,
          user: isValid ? user : null,
          loading: false,
          error: null,
        });
      } catch (error) {
        setAuthState({
          isAuthenticated: false,
          user: null,
          loading: false,
          error: 'Error al verificar autenticación',
        });
      }
    };

    checkAuth();
    // Opcional: revalidar al cambiar visibilidad (por si cookies cambiaron en otra pestaña)
    const onVis = () => checkAuth();
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  // Función para actualizar el usuario
  const setUser = (user: UserAuth | null) => {
    if (user) {
      setJsonCookie('user', user);
    } else {
      deleteCookie('user');
    }
    setAuthState(prev => ({
      ...prev,
      user,
      isAuthenticated: !!user,
    }));
  };

  // Función para actualizar el estado de autenticación
  const setIsAuthenticated = (value: boolean) => {
    setAuthState(prev => ({
      ...prev,
      isAuthenticated: value,
      // Si se desautentica, eliminar el usuario
      user: value ? prev.user : null,
    }));
    if (!value) {
      deleteCookie('user');
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    document.cookie = `token=; path=/; max-age=0; samesite=strict`;
    deleteCookie('user');
    setAuthState({
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null,
    });
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ authState, setUser, setIsAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
