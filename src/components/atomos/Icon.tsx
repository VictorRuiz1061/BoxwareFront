import { ReactNode, FC } from "react";

interface IconProps {
  icon: ReactNode;
  size?: number;
  className?: string;
}

const Icon: FC<IconProps> = ({ icon, size = 24, className = "" }) => {
  return (
    <div
      className={`inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {icon}
    </div>
  );
};

export default Icon;
