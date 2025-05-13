import React from 'react';

interface ToggleButtonProps {
  isActive: boolean;
  onChange: (isActive: boolean) => void;
  activeLabel?: string;
  inactiveLabel?: string;
  className?: string;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
  isActive,
  onChange,
  activeLabel = 'Activo',
  inactiveLabel = 'Inactivo',
  className = '',
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      <button
        type="button"
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${isActive ? 'bg-green-500' : 'bg-gray-400'}`}
        role="switch"
        aria-checked={isActive}
        onClick={() => onChange(!isActive)}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isActive ? 'translate-x-6' : 'translate-x-1'}`}
        />
      </button>
      <span className="ml-2 text-sm">
        {isActive ? activeLabel : inactiveLabel}
      </span>
    </div>
  );
};

export default ToggleButton;