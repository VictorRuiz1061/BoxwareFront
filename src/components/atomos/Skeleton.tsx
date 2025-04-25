import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular' | 'card';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'text',
  width,
  height,
  animation = 'pulse'
}) => {
  // Base classes for all skeleton types
  const baseClasses = 'bg-gray-300/30 backdrop-blur-sm';
  
  // Animation classes
  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: ''
  };
  
  // Variant specific classes
  const variantClasses = {
    text: 'h-4 rounded',
    rectangular: 'rounded-md',
    circular: 'rounded-full',
    card: 'rounded-lg shadow-md'
  };
  
  // Combine all classes
  const skeletonClasses = `${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`;
  
  // Style object for width and height
  const style: React.CSSProperties = {
    width: width !== undefined ? (typeof width === 'number' ? `${width}px` : width) : undefined,
    height: height !== undefined ? (typeof height === 'number' ? `${height}px` : height) : undefined
  };
  
  return <div className={skeletonClasses} style={style} />;
};

export default Skeleton;
