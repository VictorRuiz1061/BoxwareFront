import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useTheme } from '../../context/ThemeContext';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const { darkMode } = useTheme();
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={onClose}>
        {/* Overlay de fondo */}
        <div className={`fixed inset-0 ${darkMode ? 'bg-gray-900' : 'bg-black bg-opacity-50'}`} />
        
        <div className="flex items-center justify-center min-h-screen">
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
              className={`w-full max-w-md transform overflow-hidden rounded-lg p-6 text-left align-middle shadow-xl transition-all ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
            >
              {/* Botón de cerrar */}
              <div className="absolute top-3 right-3">
                <button
                  type="button"
                  className={`rounded-full p-1 focus:outline-none ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-900'}`}
                  onClick={onClose}
                >
                  <X size={20} />
                </button>
              </div>
              
              {/* Título */}
              {title && (
                <Dialog.Title
                  as="h3"
                  className={`text-lg font-medium leading-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}
                >
                  {title}
                </Dialog.Title>
              )}
              
              {/* Contenido */}
              <div className="mt-4">
                {children}
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Modal;
