import React from 'react';

interface IconProps {
  icon: React.ReactNode;
  size?: number;
  className?: string;
}

const Icon: React.FC<IconProps> = ({ icon, size = 24, className = '' }) => {
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
