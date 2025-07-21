// hooks/auth/useGetAuth.ts
import { useAuthContext } from '@/context/AuthContext';

export const useGetAuth = () => {
  const { authState } = useAuthContext();
  
  return { 
    isAuthenticated: authState.isAuthenticated,
    loading: authState.loading,
    user: authState.user
  };
};
