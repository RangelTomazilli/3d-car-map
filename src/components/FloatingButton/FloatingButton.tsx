import React from 'react';
import './FloatingButton.scss';

interface FloatingButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  isActive?: boolean;
  className?: string;
}

const FloatingButton: React.FC<FloatingButtonProps> = ({
  onClick,
  icon,
  label,
  position,
  isActive = false,
  className = '',
}) => {
  return (
    <button
      className={`floating-button floating-button--${position} ${
        isActive ? 'floating-button--active' : ''
      } ${className}`}
      onClick={onClick}
      title={label}
      aria-label={label}
    >
      {icon}
    </button>
  );
};

export default FloatingButton;