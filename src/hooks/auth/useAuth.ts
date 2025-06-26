// hooks/useAuth.ts
import { useNavigate } from 'react-router-dom';
import { login, register } from '@/api/auth/token';
import { LoginCredentials, RegisterData, AuthResponse } from '@/types/auth';
import { useAuthContext } from '@/context/AuthContext';

export const useAuth = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthContext();

  const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse | null> => {
    try {
      const res = await login(credentials);
      if (res.token && res.user) {
        setUser(res.user);
        navigate('/dashboard');
      }
      return res;
    } catch (error: any) {
      console.error('Error en login:', error);
      return null;
    }
  };

  const registerUser = async (data: RegisterData): Promise<AuthResponse | null> => {
    try {
      const res = await register(data);
      if (res.token) navigate('/iniciosesion');
      return res;
    } catch (error: any) {
      return null;
    }
  };

  const logoutUser = () => {
    document.cookie = `token=; path=/; max-age=0; samesite=strict`;
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  return { loginUser, registerUser, logoutUser };
};
