import './kabab-menu-icon.scss';
import React from 'react';
import { ReactComponent as KebabMenuSvg } from '../../svg/kebab-menu.svg';

interface KebabMenuIconProps {
  className?: string;
  variant?: 'dark' | 'light';
}

export const KebabMenuIcon = ({ className = '', variant = 'dark' }: KebabMenuIconProps) => {
  return <KebabMenuSvg className={`kebab-icon ${variant} ${className}`} />;
};
