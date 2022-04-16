import React from 'react';
import './button.scss';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'dark' | 'light' | 'invisible';
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
  onClick,
}: ButtonProps) => {
  return (
    <button className={`button ${variant} ${size} ${className}`} onClick={handleClick}>
      {children}
    </button>
  );

  function handleClick(event: React.MouseEvent) {
    if (!bubbleOnClickEvent) {
      event.stopPropagation();
    }
    onClick(event);
  }
};
