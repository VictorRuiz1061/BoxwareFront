import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserAuth, AuthState } from '@/types/auth';
import { hasValidToken } from '@/api/auth/token';

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
        
        // Intentar recuperar la información del usuario del localStorage
        const storedUser = localStorage.getItem('user');
        const user = storedUser ? JSON.parse(storedUser) : null;
        
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

    // Escuchar cambios en el almacenamiento
    const handleStorageChange = () => checkAuth();
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Función para actualizar el usuario
  const setUser = (user: UserAuth | null) => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
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
      localStorage.removeItem('user');
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    document.cookie = `token=; path=/; max-age=0; samesite=strict`;
    localStorage.removeItem('user');
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
