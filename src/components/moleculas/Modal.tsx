import {
  Modal as HeroModal,
  ModalContent,
  ModalHeader,
  ModalBody,
} from "@heroui/react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  return (
    <HeroModal 
      isOpen={isOpen} 
      onOpenChange={onClose}
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
        <ModalBody>
          {children}
        </ModalBody>
      </ModalContent>
    </HeroModal>
  );
}
