import React, { forwardRef } from "react";
import { Input as HeroInput } from "@heroui/react";

interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size" | "value" | "defaultValue" | "spellCheck"
> {
  label?: string;
  size?: "sm" | "md" | "lg";
  variant?: "bordered" | "underlined" | "flat" | "faded";
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
  value?: string | number;
  defaultValue?: string | number;
  spellCheck?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
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
      className = "",
      value,
      defaultValue,
      spellCheck,
      ...rest
    },
    ref
  ) => {
    return (
      <HeroInput
        ref={ref}
        label={label}
        size={size}
        variant={variant}
        color={color}
        radius={radius}
        isRequired={isRequired}
        isDisabled={isDisabled}
        isReadOnly={isReadOnly}
        isClearable={isClearable}
        onClear={onClear}
        isInvalid={isInvalid}
        errorMessage={errorMessage}
        description={description}
        startContent={leftContent}
        endContent={rightContent}
        className={className}
        fullWidth={fullWidth}
        value={value !== undefined ? String(value) : undefined}
        defaultValue={
          defaultValue !== undefined ? String(defaultValue) : undefined
        }
        spellCheck={
          spellCheck === true ? "true" : spellCheck === false ? "false" : undefined
        }
        {...rest}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;
