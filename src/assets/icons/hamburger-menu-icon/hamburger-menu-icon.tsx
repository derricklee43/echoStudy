import React from 'react';
import { ReactComponent as HamburgerMenuSvg } from '../../svg/hamburger-menu.svg';
import './hamburger-menu-icon.scss';

interface HamburgerMenuIconProps {
  className?: string;
  variant?: 'dark' | 'light';
  onClick?: (event: React.MouseEvent) => void;
}

export const HamburgerMenuIcon = ({
  className = '',
  variant = 'light',
  onClick,
}: HamburgerMenuIconProps) => {
  return (
    <HamburgerMenuSvg className={`hamburger-icon ${variant} ${className}`} onClick={onClick} />
  );
};
