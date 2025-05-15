import React from 'react';
import { motion } from 'framer-motion';

interface ToggleProps {
  isOn: boolean;
  onToggle: () => void;
  size?: number;
  activeColor?: string;
  inactiveColor?: string;
  className?: string;
  label?: string;
  disabled?: boolean;
}

const Toggle: React.FC<ToggleProps> = ({
  isOn,
  onToggle,
  size = 24,
  activeColor = 'bg-green-500',
  inactiveColor = 'bg-gray-300',
  className = '',
  label,
  disabled = false,
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {label && <span className="text-sm text-gray-700">{label}</span>}
      <motion.button
        whileHover={{ scale: disabled ? 1 : 1.05 }}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        onClick={disabled ? undefined : onToggle}
        className={`relative inline-flex h-6 w-12 cursor-${disabled ? 'not-allowed' : 'pointer'} rounded-full ${isOn ? activeColor : inactiveColor} p-1 transition-colors duration-300 ease-in-out ${disabled ? 'opacity-50' : ''}`}
        aria-checked={isOn}
        role="switch"
        aria-label={isOn ? "Activado" : "Desactivado"}
        disabled={disabled}
      >
        <motion.span
          className="inline-block h-4 w-4 rounded-full bg-white shadow-md"
          initial={false}
          animate={{
            x: isOn ? size / 3 : 0,
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </motion.button>
    </div>
  );
};

export default Toggle;
