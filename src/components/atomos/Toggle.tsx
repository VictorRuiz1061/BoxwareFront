import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

interface ToggleProps {
  isOn: boolean;
  onToggle: (e?: React.MouseEvent) => void;
  activeColor?: string;
  inactiveColor?: string;
  className?: string;
  label?: string;
  disabled?: boolean;
  estado?: boolean; // Para compatibilidad con componentes antiguos
}

const Toggle: React.FC<ToggleProps> = ({
  isOn,
  onToggle,
  activeColor,
  inactiveColor,
  className = '',
  label,
  disabled = false,
  estado,
}) => {
  const { darkMode } = useTheme();

  const isActive = estado ?? isOn;

  const defaultActiveColor = darkMode ? 'bg-blue-600' : 'bg-blue-500';
  const defaultInactiveColor = darkMode ? 'bg-red-600' : 'bg-red-500';

  const activeColorClass = activeColor || defaultActiveColor;
  const inactiveColorClass = inactiveColor || defaultInactiveColor;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {label && <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>}
      <motion.button
        type="button"
        whileHover={!disabled ? { scale: 1.05 } : {}}
        whileTap={!disabled ? { scale: 0.95 } : {}}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => {
          if (!disabled) {
            e.preventDefault();
            e.stopPropagation();
            onToggle(e);
          }
        }}
        className={`relative inline-flex h-6 w-12 rounded-full px-0.5 py-0.5 transition-colors duration-300 ease-in-out shadow-md 
          ${isActive ? activeColorClass : inactiveColorClass} 
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        aria-checked={isActive}
        role="switch"
        aria-label={isActive ? 'Activado' : 'Desactivado'}
        disabled={disabled}
      >
        <motion.span
          className="inline-block h-5 w-5 rounded-full bg-white shadow-md"
          initial={false}
          animate={{
            x: isActive ? 20 : 0,
            backgroundColor: isActive
              ? '#ffffff'
              : darkMode
              ? '#e2e8f0'
              : '#f8fafc',
          }}
          transition={{
            x: { type: 'spring', stiffness: 500, damping: 30 },
            backgroundColor: { duration: 0.2 },
          }}
        />
      </motion.button>
    </div>
  );
};

export default Toggle;
