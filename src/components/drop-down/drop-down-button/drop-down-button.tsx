import React, { ReactNode } from 'react';
import { ArrowIcon } from '../../../assets/icons/arrow-icon/arrow-icon';
import { Button } from '../../button/button';
import './drop-down-button.scss';

export interface DropDownButtonProps {
  variant?: 'dark' | 'light';
  className?: string;
  children: ReactNode;
  isOpen: boolean;
  onClick: () => void;
}

export const DropDownButton = ({
  variant = 'dark',
  className = '',
  children,
  isOpen,
  onClick,
}: DropDownButtonProps) => {
  const accentVariant = variant === 'dark' ? 'light' : 'dark';

  return (
    <Button variant={variant} onClick={onClick} className={`drop-down-button ${className}`}>
      <label>{children}</label>
      <ArrowIcon variant={accentVariant} orientation={isOpen ? 'up' : 'down'} />
    </Button>
  );
};
