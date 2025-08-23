import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useTheme } from '../../context/ThemeContext';
import { X } from 'lucide-react';
import { Botton } from '../atomos';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string; // Ejemplo: 'max-w-md', 'max-w-2xl'
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, maxWidth }) => {
  const { darkMode } = useTheme();

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={onClose}>
        
        {/* Overlay borroso */}
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm" />

        {/* Contenedor centrado */}
        <div className="flex items-center justify-center min-h-screen p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel 
              className={`relative w-full ${maxWidth || 'max-w-2xl'} transform overflow-hidden rounded-lg p-6 text-left align-middle shadow-xl transition-all ${
                darkMode
                  ? 'bg-gradient-to-b from-indigo-950 to-gray-900 text-white border border-indigo-800'
                  : 'bg-white text-gray-900'
              }`}
            >
              {/* Botón de cerrar */}
              <div className="absolute top-3 right-3">
                <Botton
                  variant="light"
                  className={`rounded-full p-1 focus:outline-none ${
                    darkMode ? 'text-indigo-400 hover:text-purple-300' : 'text-gray-400 hover:text-gray-900'
                  }`}
                  onClick={onClose}
                >
                  <X size={20} />
                </Botton>
              </div>
              
              {/* Título */}
              {title && (
                <Dialog.Title
                  as="h3"
                  className={`text-lg font-medium leading-6 ${
                    darkMode ? 'text-purple-100' : 'text-gray-900'
                  }`}
                >
                  {title}
                </Dialog.Title>
              )}
              
              {/* Contenido */}
              <div className="mt-4">{children}</div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Modal;
