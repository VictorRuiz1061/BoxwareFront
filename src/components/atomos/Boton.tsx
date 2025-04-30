import { Button, ButtonProps } from "@heroui/react";
import { ReactNode } from "react";

interface BotonProps extends ButtonProps {
  children?: ReactNode;
  onClick?: () => void;
}

const Boton = ({ children = "Click", ...props }: BotonProps) => {
  return <Button {...props}>{children}</Button>;
};

export default Boton;
