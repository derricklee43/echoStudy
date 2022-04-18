import React from 'react';
import './button.scss';

interface ButtonProps {
  children: React.ReactNode;
  ariaLabel?: string;
  variant?: 'dark' | 'light' | 'invisible' | 'disabled';
  size?: 'small' | 'medium';
  className?: string;
  bubbleOnClickEvent?: boolean;
  onClick: (event: React.MouseEvent) => void;
}

export const Button = ({
  className = '',
  variant = 'dark',
  size = 'small',
  bubbleOnClickEvent = true,
  children,
  ariaLabel,
  onClick,
}: ButtonProps) => {
  return (
    <button
      className={`button ${variant} ${size} ${className}`}
      onClick={handleClick}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );

  function handleClick(event: React.MouseEvent) {
    if (variant !== 'disabled') {
      if (!bubbleOnClickEvent) {
        event.stopPropagation();
      }
      onClick(event);
    }
  }
};
