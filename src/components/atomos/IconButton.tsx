import React from "react";

interface IconButtonProps {
  icon: React.ReactNode;
  onClick?: (e?: React.MouseEvent) => void;
  color?: string; // clase de color tailwind o similar
  size?: "sm" | "md" | "lg" | number;
  className?: string;
  title?: string;
  disabled?: boolean;
}

const sizeMap = {
  sm: "w-6 h-6 text-sm p-1",
  md: "w-8 h-8 text-base p-1.5",
  lg: "w-10 h-10 text-lg p-2"
};

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onClick,
  color = "bg-green-500 text-white",
  size = "md",
  className = "",
  title = "",
  disabled = false
}) => {
  const sizeClass = typeof size === "string" ? sizeMap[size] : `w-[${size}px] h-[${size}px]`;
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center rounded-full focus:outline-none transition ${color} ${sizeClass} ${className}`}
      title={title}
      disabled={disabled}
    >
      {icon}
    </button>
  );
};

export default IconButton; 