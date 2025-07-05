import { addToast } from "@heroui/react";

// Tipos de toast disponibles
type ToastType = 'success' | 'error' | 'warning' | 'info';

// Interfaz para las propiedades del toast
interface ToastOptions {
  title?: string;
  description: string;
  duration?: number;
}

export const showToast = (type: ToastType, options: ToastOptions) => {
  // Configuración predeterminada según el tipo
  const defaults = {
    success: {
      title: '¡Éxito!',
      color: 'primary',
    },
    error: {
      title: 'Error',
      color: 'danger',
    },
    warning: {
      title: 'Advertencia',
      color: 'warning',
    },
    info: {
      title: 'Información',
      color: 'primary',
    },
  };

  // Combinar opciones predeterminadas con las proporcionadas
  const toastConfig = {
    title: options.title || defaults[type].title,
    description: options.description,
    color: defaults[type].color as any,
    // Eliminamos hideIconWrapper que causa advertencias
    variant: "solid" as "solid", // Tipado explícito para variant
    duration: options.duration || 3000, // 3 segundos por defecto
  };

  // Mostrar el toast
  addToast(toastConfig);
};

// Funciones de conveniencia para cada tipo de toast que aceptan directamente un mensaje
export const showSuccessToast = (message: string) => showToast('success', { description: message });
export const showErrorToast = (message: string) => showToast('error', { description: message });
export const showWarningToast = (message: string) => showToast('warning', { description: message });
export const showInfoToast = (message: string) => showToast('info', { description: message });

// Exportación por defecto para mantener compatibilidad
export default {
  showToast,
  showSuccessToast,
  showErrorToast,
  showWarningToast,
  showInfoToast,
};
