import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { AuthState } from '@/types/auth';

// Utilidad para manejar el token en cookies
const TOKEN_COOKIE_KEY = 'token';
const getTokenFromCookie = (): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${TOKEN_COOKIE_KEY}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
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

const initialAuthState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: true,
  error: null,
};

export function useGetAuth() {
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);

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

  return { ...authState, getTokenFromCookie };
} 