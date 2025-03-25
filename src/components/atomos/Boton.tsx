import { Button } from "@heroui/react";

const Boton = ({ children = "Click", ...props }) => {
  return <Button {...props}>{children}</Button>;
};

export default Boton;
