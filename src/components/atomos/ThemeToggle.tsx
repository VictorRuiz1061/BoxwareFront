import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <motion.button
      onClick={toggleDarkMode}
      className={`relative p-2 rounded-full ${darkMode ? 'bg-blue-900/10' : 'bg-yellow-500/0'} ${className}`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      aria-label={darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    >
      <motion.div
        initial={false}
        animate={{ rotate: darkMode ? 360 : 0 }}
        transition={{ duration: 0.7, type: "spring", stiffness: 100 }}
        className="relative w-6 h-6"
      >
        {darkMode ? (
          // Luna personalizada con resplandor
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-blue-300/30 blur-sm animate-pulse"></div>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="text-blue-200 w-6 h-6"
            >
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
              <circle cx="19" cy="5" r="1" fill="currentColor" className="text-blue-100" />
              <circle cx="12" cy="12" r="0.5" fill="currentColor" className="text-blue-50" />
              <circle cx="8" cy="9" r="0.5" fill="currentColor" className="text-blue-50" />
            </svg>
          </div>
        ) : (
          // Sol con resplandor
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-yellow-300/40 blur-sm animate-pulse"></div>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="text-yellow-500 w-6 h-6"
            >
              <circle cx="12" cy="12" r="4"></circle>
              <path d="M12 2v2"></path>
              <path d="M12 20v2"></path>
              <path d="m4.93 4.93 1.41 1.41"></path>
              <path d="m17.66 17.66 1.41 1.41"></path>
              <path d="M2 12h2"></path>
              <path d="M20 12h2"></path>
              <path d="m6.34 17.66-1.41 1.41"></path>
              <path d="m19.07 4.93-1.41 1.41"></path>
            </svg>
          </div>
        )}
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
