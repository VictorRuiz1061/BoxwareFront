import React, { createContext, useState, useContext, useEffect } from 'react';
import { getCookie, setCookie } from '@/api/axiosConfig';

type ThemeContextType = {
  darkMode: boolean;
  toggleDarkMode: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    // Leer preferencia desde cookie
    const saved = getCookie('darkMode');
    return saved ? saved === 'true' : false;
  });

  useEffect(() => {
    // Guardar preferencia en cookie (30 días)
    setCookie('darkMode', String(darkMode), { maxAge: 60 * 60 * 24 * 30 });
    
    // Apply theme to document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
