import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  return (
    <div 
      className={`bg-white/20 backdrop-blur-sm rounded-lg shadow-lg p-6 border border-white/30 ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
