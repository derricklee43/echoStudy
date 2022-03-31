import React from 'react';
import './button.scss';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'dark' | 'light' | 'invisible';
  className?: string;
  bubbleOnClickEvent?: boolean;
  onClick: (event: React.MouseEvent) => void;
}

export const Button = ({
  className,
  variant = 'dark',
  bubbleOnClickEvent = true,
  children,
  onClick,
}: ButtonProps) => {
  return (
    <button className={`button ${variant} ${className || ''}`} onClick={handleClick}>
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
