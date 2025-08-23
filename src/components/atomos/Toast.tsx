import { addToast, type ToastProps } from "@heroui/react";

// Tipos de toast disponibles (coinciden con HeroUI)
type ToastType = "success" | "error" | "warning" | "info";

// Interfaz para las propiedades del toast
interface ToastOptions {
  title?: string;
  description: string;
  // HeroUI utiliza "timeout" para controlar el auto-cierre del toast
  timeout?: number;
}

// Mapa de configuración predeterminada por tipo
const defaults: Record<ToastType, { title: string; color: ToastProps["color"] }> = {
  success: {
    title: "¡Éxito!",
    color: "primary",
  },
  error: {
    title: "Error",
    color: "danger",
  },
  warning: {
    title: "Advertencia",
    color: "warning",
  },
  info: {
    title: "Información",
    color: "primary",
  },
};

export const showToast = (type: ToastType, options: ToastOptions) => {
  // Validación extra para description
  if (!options.description?.trim()) {
    console.warn("Intentaste mostrar un toast sin descripción.");
    return;
  }

  const config = defaults[type] ?? defaults.info; // fallback seguro

  addToast({
    title: options.title || config.title,
    description: options.description,
    color: config.color,
    variant: "solid",
    // HeroUI espera la propiedad "timeout" en milisegundos
    timeout: options.timeout ?? 3000, // 3 segundos por defecto
  });
};

// Funciones de conveniencia
export const showSuccessToast = (message: string) =>
  showToast("success", { description: message });
export const showErrorToast = (message: string) =>
  showToast("error", { description: message });
export const showWarningToast = (message: string) =>
  showToast("warning", { description: message });
export const showInfoToast = (message: string) =>
  showToast("info", { description: message });

// Exportación por defecto para compatibilidad
export default {
  showToast,
  showSuccessToast,
  showErrorToast,
  showWarningToast,
  showInfoToast,
};
