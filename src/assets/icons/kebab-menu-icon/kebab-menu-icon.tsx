import React from 'react';
import { ReactComponent as KebabMenuSvg } from '@/assets/svg/kebab-menu.svg';
import './kebab-menu-icon.scss';

export interface KebabMenuIconProps {
  className?: string;
  variant?: 'blue' | 'white' | 'green' | 'red' | 'light-blue';
  onClick?: () => void;
}

export const KebabMenuIcon = ({
  className = '',
  variant = 'blue',
  onClick,
}: KebabMenuIconProps) => {
  return <KebabMenuSvg className={`kebab-icon ${variant} ${className}`} onClick={onClick} />;
};
