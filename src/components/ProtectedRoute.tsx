import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import React from 'react';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null; // O un loader/spinner

  return isAuthenticated ? <>{children}</> : <Navigate to="/iniciosesion" replace />;
};

export default ProtectedRoute; 