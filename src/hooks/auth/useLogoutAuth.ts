import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const TOKEN_COOKIE_KEY = 'token';
const removeTokenCookie = () => {
  document.cookie = `${TOKEN_COOKIE_KEY}=; path=/; max-age=0; samesite=strict`;
};

export function useLogoutAuth() {
  const navigate = useNavigate();

  const logout = useCallback(() => {
    removeTokenCookie();
    navigate('/iniciosesion');
  }, [navigate]);

  return { logout };
} 