import React from 'react';
import { motion } from 'framer-motion';
import { ToggleLeft, ToggleRight } from 'lucide-react';
import Boton from './Boton';

interface ToggleEstadoBotonProps {
  estado: boolean;
  onToggle: () => void;
  size?: number;
  activeColor?: string;
  inactiveColor?: string;
  className?: string;
}

const ToggleEstadoBoton: React.FC<ToggleEstadoBotonProps> = ({
  estado,
  onToggle,
  size = 18,
  activeColor = 'bg-green-500',
  inactiveColor = 'bg-gray-500',
  className = '',
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Boton
        onPress={onToggle}
        className={`${estado ? activeColor : inactiveColor} text-white px-2 py-1 flex items-center justify-center transition-all duration-300 ease-in-out ${className}`}
        aria-label={estado ? "Desactivar" : "Activar"}
      >
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: estado ? 0 : 180 }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 120 }}
        >
          {estado ? <ToggleRight size={size} /> : <ToggleLeft size={size} />}
        </motion.div>
      </Boton>
    </motion.div>
  );
};

export default ToggleEstadoBoton;
