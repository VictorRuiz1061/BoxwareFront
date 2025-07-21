import {Button} from "@heroui/react";

interface BotonProps {
    texto?: string;
    color?: "primary" | "secondary" | "success" | "warning" | "danger" | "default";
    variant?: "solid" | "faded" | "bordered" | "light" | "flat" | "ghost" | "shadow";
    // onClick?: () => void;
    onClick?: (e?: React.MouseEvent) => void;
    children?: React.ReactNode;
    disabled?: boolean;
    className?: string;
}

const Botton = ({ texto = "Crear", color = "primary", variant = "solid", onClick, children, disabled, className }: BotonProps) => {
  return (
    <Button color={color} variant={variant} onClick={onClick} disabled={disabled} className={className}>
      {children || texto}
    </Button>
  );
};

export default Botton;
