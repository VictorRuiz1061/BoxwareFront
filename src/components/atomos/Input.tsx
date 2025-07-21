import React, { forwardRef } from 'react';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "bordered" | "underlined" | "filled";
  color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
  radius?: "none" | "sm" | "md" | "lg" | "full";
  fullWidth?: boolean;
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  description?: string;
  errorMessage?: string;
  isInvalid?: boolean;
  isRequired?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isClearable?: boolean;
  onClear?: () => void;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  descriptionClassName?: string;
  errorClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ 
  label, 
  size = "lg",
  variant = "underlined",
  color = "warning",
  radius = "lg",
  fullWidth = true,
  leftContent,
  rightContent,
  description,
  errorMessage,
  isInvalid = false,
  isRequired = false,
  isDisabled = false,
  isReadOnly = false,
  isClearable = false,
  onClear,
  className = '',
  labelClassName = '',
  inputClassName = '',
  descriptionClassName = '',
  errorClassName = '',
  ...rest 
}, ref) => {
  
  // Clases base
  const baseClasses = "transition-all duration-200 focus:outline-none";
  
  // Clases de tamaño
  const sizeClasses = {
    sm: "px-2 py-1 text-sm",
    md: "px-3 py-2 text-base",
    lg: "px-4 py-3 text-lg"
  };
  
  // Clases de radio
  const radiusClasses = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full"
  };
  
  // Clases de variante
  const variantClasses = {
    default: "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800",
    bordered: "border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800",
    underlined: "border-b-2 border-gray-300 dark:border-gray-600 bg-transparent rounded-none",
    filled: "border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
  };
  
  // Clases de color
  const colorClasses = {
    default: "focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400",
    primary: "focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400",
    secondary: "focus:ring-gray-500 focus:border-gray-500 dark:focus:ring-gray-400 dark:focus:border-gray-400",
    success: "focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-400 dark:focus:border-green-400",
    warning: "focus:ring-yellow-500 focus:border-yellow-500 dark:focus:ring-yellow-400 dark:focus:border-yellow-400",
    danger: "focus:ring-red-500 focus:border-red-500 dark:focus:ring-red-400 dark:focus:border-red-400"
  };
  
  // Clases de estado
  const stateClasses = {
    disabled: "opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-700",
    readonly: "bg-gray-50 dark:bg-gray-700 cursor-default",
    invalid: "border-red-500 dark:border-red-400 focus:ring-red-500 focus:border-red-500 dark:focus:ring-red-400 dark:focus:border-red-400"
  };
  
  // Construir clases del input
  const inputClasses = [
    baseClasses,
    sizeClasses[size],
    radiusClasses[radius],
    variantClasses[variant],
    colorClasses[color],
    fullWidth ? "w-full" : "",
    isDisabled ? stateClasses.disabled : "",
    isReadOnly ? stateClasses.readonly : "",
    isInvalid ? stateClasses.invalid : "",
    "text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400",
    inputClassName
  ].filter(Boolean).join(" ");
  
  // Clases del contenedor
  const containerClasses = [
    fullWidth ? "w-full" : "",
    className
  ].filter(Boolean).join(" ");
  
  // Clases del label
  const labelClasses = [
    "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1",
    isRequired ? "after:content-['*'] after:ml-0.5 after:text-red-500" : "",
    labelClassName
  ].filter(Boolean).join(" ");
  
  // Clases de descripción
  const descClasses = [
    "text-sm text-gray-500 dark:text-gray-400 mt-1",
    descriptionClassName
  ].filter(Boolean).join(" ");
  
  // Clases de error
  const errorClasses = [
    "text-sm text-red-600 dark:text-red-400 mt-1",
    errorClassName
  ].filter(Boolean).join(" ");

  return (
    <div className={containerClasses}>
      {/* Label */}
      {label && (
        <label className={labelClasses}>
          {label}
        </label>
      )}
      
      {/* Contenedor del input con contenido lateral */}
      <div className="relative">
        {/* Contenido izquierdo */}
        {leftContent && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {leftContent}
          </div>
        )}
        
        {/* Input principal */}
        <input
          ref={ref}
          className={inputClasses}
          disabled={isDisabled}
          readOnly={isReadOnly}
          {...rest}
        />
        
        {/* Contenido derecho */}
        {rightContent && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {rightContent}
          </div>
        )}
      </div>
      
      {/* Descripción */}
      {description && !isInvalid && (
        <p className={descClasses}>
          {description}
        </p>
      )}
      
      {/* Mensaje de error */}
      {isInvalid && errorMessage && (
        <p className={errorClasses}>
          {errorMessage}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
