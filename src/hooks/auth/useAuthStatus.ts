// hooks/useAuthStatus.ts
import { useAuthContext } from '@/context/AuthContext';

export const useAuthStatus = () => {
  const { authState } = useAuthContext();
  
  return { 
    isAuthenticated: authState.isAuthenticated,
    loading: authState.loading,
    user: authState.user
  };
};
