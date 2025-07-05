// import {Button} from "@heroui/react";

// interface BotonProps {
//     children: React.ReactNode;
//     color?: "primary" | "secondary" | "success" | "warning" | "danger";
//     variant?: "solid" | "faded" | "bordered" | "light" | "flat" | "ghost" | "shadow";
//     onPress?: () => void;
// }

// export default function Boton({ children, color = "primary", variant = "shadow", onPress }: BotonProps) {

//   return (
//     <Button color={color} variant={variant} onPress={onPress}>
//       {children}
//     </Button>
//   );
import { Button, ButtonProps } from "@heroui/react";
import { ReactNode } from "react";

interface BotonProps extends ButtonProps {
  children?: ReactNode;
  onClick?: () => void;
  onPress?: () => void;
}

const Boton = ({ children = "Click", ...props }: BotonProps) => {
  return <Button {...props}>{children}</Button>;
};

export default Boton;