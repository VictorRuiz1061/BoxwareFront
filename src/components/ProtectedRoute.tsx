import { useGetAuth } from '@/hooks/auth';
import { hasValidToken } from '@/api/auth/token';
import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, loading } = useGetAuth();
  const [isChecking, setIsChecking] = useState(true);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    // Verificación adicional de token válido
    const checkToken = () => {
      const tokenValid = hasValidToken();
      setHasToken(tokenValid);
      setIsChecking(false);
    };
    
    checkToken();
  }, []);

  // Mostrar un indicador de carga mientras se verifica la autenticación
  if (loading || isChecking) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-700 font-medium">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Redireccionar si no está autenticado o no tiene token válido
  if (!isAuthenticated || !hasToken) {
    console.log('Acceso denegado: Usuario no autenticado o token inválido');
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;