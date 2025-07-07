import {
  Modal as HeroModal,
  ModalContent,
  ModalHeader,
  ModalBody,
} from "@heroui/react";
import { useCallback } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  // Envolver el onClose en un useCallback para prevenir comportamientos inesperados
  const handleClose = useCallback((open: boolean) => {
    if (!open) {
      // Solo llamar onClose cuando el modal se está cerrando
      onClose();
    }
  }, [onClose]);
  
  return (
    <HeroModal 
      isOpen={isOpen} 
      onOpenChange={handleClose}
      scrollBehavior="inside"
      onSubmit={(e) => {
        // Prevenir que el formulario dentro del modal cause recarga de página
        e.preventDefault();
      }}
    >
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
        <ModalBody>
          {children}
        </ModalBody>
      </ModalContent>
    </HeroModal>
  );
}
