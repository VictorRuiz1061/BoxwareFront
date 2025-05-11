import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

interface SuccessAlertProps {
  show: boolean;
  message: string;
  onClose: () => void;
  autoCloseTime?: number;
}

const SuccessAlert: React.FC<SuccessAlertProps> = ({
  show,
  message,
  onClose,
  autoCloseTime = 3000,
}) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseTime);
      return () => clearTimeout(timer);
    }
  }, [show, onClose, autoCloseTime]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed top-4 right-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 max-w-md"
        >
          <CheckCircle className="text-white" size={20} />
          <span className="flex-1">{message}</span>
          <button 
            onClick={onClose} 
            className="ml-2 text-white hover:text-gray-200 focus:outline-none"
            aria-label="Cerrar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SuccessAlert;
