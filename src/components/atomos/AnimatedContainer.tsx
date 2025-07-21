import React, { ReactNode, useEffect, useState } from 'react';

interface AnimatedContainerProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  animation?: 'slideUp' | 'fadeIn' | 'scaleIn' | 'slideFromLeft' | 'slideFromRight';
}

const AnimatedContainer: React.FC<AnimatedContainerProps> = ({
  children,
  className = '',
  delay = 400,
  duration = 800,
  animation = 'slideUp'
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  // Animation classes
  const animationClasses = {
    slideUp: 'translate-y-16 opacity-0',
    fadeIn: 'opacity-0',
    scaleIn: 'scale-95 opacity-0',
    slideFromLeft: '-translate-x-16 opacity-0',
    slideFromRight: 'translate-x-16 opacity-0'
  };

  // Base transition class
  const transitionClass = `transition-all ease-out ${duration ? `duration-${duration}` : 'duration-500'}`;

  return (
    <div
      className={`${className} ${transitionClass} ${isVisible ? '' : animationClasses[animation]}`}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
};

export default AnimatedContainer;
